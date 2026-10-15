'use client';

import { useForm, SubmitHandler, FieldErrors, Path } from "react-hook-form";
import { savePlan, updatePlan, getPlanById } from "@/api/planApi";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { toCalendarDate } from "@/lib/calendarDate";
import { PlanPayload } from "@/lib/types";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PlanFormProps {
  propertyId: number;
  documentId?: number; // edit this plan; without it the form creates a new one
  isReadOnly?: boolean;
}

interface FormData {
  generalPlan: boolean;
  planNumber: number;
  year: number;
  professional: string;
  professionalContact: string;
  numberVisado: number;
  dateVisado: string;
  planImage?: string;
  structurePlan: boolean;
  structureImage?: string;
  gasPlan: boolean;
  gasImage?: string;
  waterPlan: boolean;
  waterImage?: string;
  lightPlan: boolean;
  lightImage?: string;
  projectPlan: boolean;
  projectImage?: string;
  finalPlan: boolean;
  finalImage?: string;
  planType: string;
  planNumberUpdate: number;
  yearUpdate: number;
  stateImage?: string;
  formalities: string;
  documentation: string;
  contacts: string;
  imageVisado?: string;
}

const EMPTY_PLAN: Partial<FormData> = {
  generalPlan: false,
  structurePlan: false,
  gasPlan: false,
  waterPlan: false,
  lightPlan: false,
  projectPlan: false,
  finalPlan: false,
};

// Fields copied from GET /plans/:id into the form (dateVisado is formatted apart).
const LOADED_FIELDS: (keyof FormData)[] = [
  "generalPlan",
  "planNumber",
  "year",
  "professional",
  "professionalContact",
  "numberVisado",
  "structurePlan",
  "gasPlan",
  "waterPlan",
  "lightPlan",
  "projectPlan",
  "finalPlan",
  "planType",
  "planNumberUpdate",
  "yearUpdate",
  "formalities",
  "documentation",
  "contacts",
  "planImage",
  "structureImage",
  "gasImage",
  "waterImage",
  "lightImage",
  "projectImage",
  "finalImage",
  "stateImage",
  "imageVisado",
];

// Explicit field list, so nothing reset()/setValue() loaded (id, property,
// timestamps) is echoed back: the Update DTO rejects unknown keys with 400.
const buildPlanPayload = (data: FormData): PlanPayload => ({
  generalPlan: data.generalPlan,
  planNumber: Number(data.planNumber),
  year: Number(data.year),
  planImage: data.planImage,
  structurePlan: data.structurePlan,
  structureImage: data.structureImage,
  gasPlan: data.gasPlan,
  gasImage: data.gasImage,
  waterPlan: data.waterPlan,
  waterImage: data.waterImage,
  lightPlan: data.lightPlan,
  lightImage: data.lightImage,
  projectPlan: data.projectPlan,
  projectImage: data.projectImage,
  finalPlan: data.finalPlan,
  finalImage: data.finalImage,
  planType: data.planType,
  planNumberUpdate: Number(data.planNumberUpdate),
  yearUpdate: Number(data.yearUpdate),
  stateImage: data.stateImage,
  professional: data.professional,
  professionalContact: data.professionalContact,
  dateVisado: data.dateVisado,
  numberVisado: Number(data.numberVisado),
  imageVisado: data.imageVisado,
  formalities: data.formalities,
  documentation: data.documentation,
  contacts: data.contacts,
});

const PlanForm = ({ propertyId, documentId, isReadOnly = false }: PlanFormProps) => {
  const router = useRouter();
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: EMPTY_PLAN,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (isReadOnly) return;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const preview = reader.result as string;
        setImagePreviews((prev) => ({ ...prev, [fieldName]: preview }));

        // Upload to Supabase
        const url = await uploadImageToSupabase(file, `plans/property-${propertyId}`);
        if (url) {
          setValue(fieldName as Path<FormData>, url);
        } else {
          alert("No se pudo subir la imagen. Verifica que el bucket 'documents' exista y tenga acceso permitido.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (fieldName: keyof FormData) => {
    const currentUrl = getValues(fieldName as Path<FormData>) as string | undefined;

    if (currentUrl) {
      const deleted = await deleteImageByPublicUrl(currentUrl);
      if (!deleted) {
        alert("No se pudo eliminar la imagen en Supabase.");
        return;
      }
    }

    setValue(fieldName as Path<FormData>, "");
    setImagePreviews((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const renderImagePreviewActions = (fieldName: keyof FormData, imageName: string) => {
    const imageUrl = resolveImageUrl(imagePreviews[fieldName as string]);
    if (!imageUrl) return null;

    return (
      <div className="doc-preview-card">
        <img src={imageUrl} alt="Preview" className="h-auto w-40 rounded border border-gray-600" />
        <button
          type="button"
          onClick={() => handleRemoveImage(fieldName)}
          disabled={isReadOnly}
          className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          title="Eliminar imagen"
        >
          <span aria-hidden="true">🗑</span>
        </button>
        <ImageViewModal imageUrl={imageUrl} imageName={imageName} />
      </div>
    );
  };

  useEffect(() => {
    reset(EMPTY_PLAN);
    setImagePreviews({});

    // Without documentId the form stays empty: it creates a new plan.
    if (!documentId) return;
    let cancelled = false;

    const loadPlan = async () => {
      try {
        const plan: Partial<FormData> | undefined = await getPlanById(documentId);
        if (cancelled || !plan) return;

        LOADED_FIELDS.forEach((field) => {
          if (plan[field] !== undefined && plan[field] !== null) {
            setValue(field, plan[field]);
          }
        });

        setValue("dateVisado", toCalendarDate(plan.dateVisado));

        setImagePreviews({
          planImage: resolveImageUrl(plan.planImage) || "",
          structureImage: resolveImageUrl(plan.structureImage) || "",
          gasImage: resolveImageUrl(plan.gasImage) || "",
          waterImage: resolveImageUrl(plan.waterImage) || "",
          lightImage: resolveImageUrl(plan.lightImage) || "",
          projectImage: resolveImageUrl(plan.projectImage) || "",
          finalImage: resolveImageUrl(plan.finalImage) || "",
          stateImage: resolveImageUrl(plan.stateImage) || "",
          imageVisado: resolveImageUrl(plan.imageVisado) || "",
        });
      } catch (error) {
        if (cancelled) return;
        console.error("Error loading plan:", error);
        alert(`No se pudo cargar el plano #${documentId}: ${extractApiErrorMessage(error)}`);
      }
    };

    loadPlan();
    return () => {
      cancelled = true;
    };
  }, [documentId, reset, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!propertyId) {
        alert("No hay propiedad seleccionada. Volve a la lista y elegi una propiedad primero.");
        return;
      }

      setLoading(true);
      const payload = buildPlanPayload(data);
      if (documentId) {
        await updatePlan(documentId, payload);
      } else {
        await savePlan({ ...payload, propertyId });
      }
      alert("Plan guardado exitosamente");
      router.push(`/property/details?id=${propertyId}`);
    } catch (error) {
      console.error("Error saving plan:", error);
      alert(`Error al guardar el plan: ${extractApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    const labels: Record<string, string> = {
      planNumber: "N° de Plano",
      year: "Año",
      professional: "Profesional",
      professionalContact: "Contacto Profesional",
      planType: "Tipo de Plano",
      planNumberUpdate: "N° de Plano (Actualización)",
      yearUpdate: "Año (Actualización)",
      formalities: "Formalidades",
      documentation: "Documentación",
      contacts: "Contactos",
      numberVisado: "Visado Municipal",
      dateVisado: "Fecha Visado",
    };

    alertMissingFields(formErrors as Record<string, unknown>, labels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="doc-form w-full">
      <fieldset disabled={isReadOnly} className="contents">

        <h1 className="doc-title">Formulario de Plano de Casa</h1>
        <p className="doc-subtitle">Propiedad actual: #{propertyId || "sin seleccionar"}</p>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Detalles del Plano</legend>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("generalPlan")} id="generalPlan" className="h-4 w-4" />
              <label htmlFor="generalPlan" className="text-gray-200">Plano General</label>
            </div>
            <div>
              <label htmlFor="planImage" className="block text-gray-300 mb-1">Imagen Plano General</label>
              <input id="planImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "planImage")} />
              {renderImagePreviewActions("planImage", "Plano General")}
            </div>
            <div>
              <label htmlFor="nro-plano" className="block text-gray-300 mb-1">N° de Plano</label>
              <input id="nro-plano" type="number" className="doc-input" {...register("planNumber", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.planNumber && <p className="text-red-400 text-sm mt-1">{errors.planNumber.message}</p>}
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-300 mb-1">Año</label>
              <input id="year" type="number" className="doc-input" {...register("year", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <label htmlFor="profesional" className="block text-gray-300 mb-1">Profesional</label>
              <input id="profesional" className="doc-input" {...register("professional", { required: "Campo obligatorio" })} />
              {errors.professional && <p className="text-red-400 text-sm mt-1">{errors.professional.message}</p>}
            </div>
            <div>
              <label htmlFor="contactoProfesional" className="block text-gray-300 mb-1">Contacto Profesional</label>
              <input id="contactoProfesional" className="doc-input" {...register("professionalContact", { required: "Campo obligatorio" })} />
              {errors.professionalContact && <p className="text-red-400 text-sm mt-1">{errors.professionalContact.message}</p>}
            </div>
          </section>
        </fieldset>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Planos Adicionales</legend>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("structurePlan")} id="structurePlan" className="h-4 w-4" />
              <label htmlFor="structurePlan" className="text-gray-200">Plano Estructura</label>
            </div>
            <div>
              <label htmlFor="structureImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="structureImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "structureImage")} />
              {renderImagePreviewActions("structureImage", "Plano Estructura")}
            </div>
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("gasPlan")} id="gasPlan" className="h-4 w-4" />
              <label htmlFor="gasPlan" className="text-gray-200">Plano Gas</label>
            </div>
            <div>
              <label htmlFor="gasImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="gasImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "gasImage")} />
              {renderImagePreviewActions("gasImage", "Plano Gas")}
            </div>
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("waterPlan")} id="waterPlan" className="h-4 w-4" />
              <label htmlFor="waterPlan" className="text-gray-200">Plano Agua</label>
            </div>
            <div>
              <label htmlFor="waterImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="waterImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "waterImage")} />
              {renderImagePreviewActions("waterImage", "Plano Agua")}
            </div>
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("lightPlan")} id="lightPlan" className="h-4 w-4" />
              <label htmlFor="lightPlan" className="text-gray-200">Plano Luz</label>
            </div>
            <div>
              <label htmlFor="lightImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="lightImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "lightImage")} />
              {renderImagePreviewActions("lightImage", "Plano Luz")}
            </div>
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("projectPlan")} id="projectPlan" className="h-4 w-4" />
              <label htmlFor="projectPlan" className="text-gray-200">Anteproyecto</label>
            </div>
            <div>
              <label htmlFor="projectImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="projectImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "projectImage")} />
              {renderImagePreviewActions("projectImage", "Anteproyecto")}
            </div>
            <div className="doc-checkbox-card">
              <input type="checkbox" {...register("finalPlan")} id="finalPlan" className="h-4 w-4" />
              <label htmlFor="finalPlan" className="text-gray-200">Final de Obra</label>
            </div>
            <div>
              <label htmlFor="finalImage" className="block text-gray-300 mb-1">Imagen</label>
              <input id="finalImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "finalImage")} />
              {renderImagePreviewActions("finalImage", "Final de Obra")}
            </div>
          </section>
        </fieldset>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Actualización</legend>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <label htmlFor="planType" className="block text-gray-300 mb-1">Tipo de Plano</label>
              <select id="planType" className="doc-input" {...register("planType", { required: "Campo obligatorio" })}>
                <option value="">Seleccionar</option>
                <option value="General">General</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Gas">Gas</option>
                <option value="Agua">Agua</option>
              </select>
              {errors.planType && <p className="text-red-400 text-sm mt-1">{errors.planType.message}</p>}
            </div>
            <div>
              <label htmlFor="planNumberUpdate" className="block text-gray-300 mb-1">N° de Plano</label>
              <input id="planNumberUpdate" type="number" className="doc-input" {...register("planNumberUpdate", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.planNumberUpdate && <p className="text-red-400 text-sm mt-1">{errors.planNumberUpdate.message}</p>}
            </div>
            <div>
              <label htmlFor="yearUpdate" className="block text-gray-300 mb-1">Año</label>
              <input id="yearUpdate" type="number" className="doc-input" {...register("yearUpdate", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.yearUpdate && <p className="text-red-400 text-sm mt-1">{errors.yearUpdate.message}</p>}
            </div>
            <div>
              <label htmlFor="formalities" className="block text-gray-300 mb-1">Formalidades</label>
              <input id="formalities" className="doc-input" {...register("formalities", { required: "Campo obligatorio" })} />
              {errors.formalities && <p className="text-red-400 text-sm mt-1">{errors.formalities.message}</p>}
            </div>
            <div>
              <label htmlFor="documentation" className="block text-gray-300 mb-1">Documentación</label>
              <input id="documentation" className="doc-input" {...register("documentation", { required: "Campo obligatorio" })} />
              {errors.documentation && <p className="text-red-400 text-sm mt-1">{errors.documentation.message}</p>}
            </div>
            <div>
              <label htmlFor="contacts" className="block text-gray-300 mb-1">Contactos</label>
              <input id="contacts" className="doc-input" {...register("contacts", { required: "Campo obligatorio" })} />
              {errors.contacts && <p className="text-red-400 text-sm mt-1">{errors.contacts.message}</p>}
            </div>
            <div>
              <label htmlFor="numberVisado" className="block text-gray-300 mb-1">Visado Municipal</label>
              <input id="numberVisado" type="number" className="doc-input" {...register("numberVisado", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.numberVisado && <p className="text-red-400 text-sm mt-1">{errors.numberVisado.message}</p>}
            </div>
            <div>
              <label htmlFor="dateVisado" className="block text-gray-300 mb-1">Fecha Visado</label>
              <input id="dateVisado" type="date" className="doc-input" {...register("dateVisado", { required: "Campo obligatorio" })} />
              {errors.dateVisado && <p className="text-red-400 text-sm mt-1">{errors.dateVisado.message}</p>}
            </div>
            <div>
              <label htmlFor="imageVisado" className="block text-gray-300 mb-1">Imagen Visado</label>
              <input id="imageVisado" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "imageVisado")} />
              {renderImagePreviewActions("imageVisado", "Imagen Visado")}
            </div>
            <div>
              <label htmlFor="stateImage" className="block text-gray-300 mb-1">Imagen Estado</label>
              <input id="stateImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "stateImage")} />
              {renderImagePreviewActions("stateImage", "Imagen Estado")}
            </div>
          </section>
        </fieldset>
      </fieldset>

      {!isReadOnly && (
        <button type="submit" disabled={loading} className="doc-submit-btn">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      )}
    </form>
  );
};

export default PlanForm;