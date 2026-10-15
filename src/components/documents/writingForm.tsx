'use client';

import { useForm, SubmitHandler, FieldErrors, Path } from "react-hook-form";
import { saveWriting, updateWriting, getWritingById } from "@/api/writingApi";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { toCalendarDate } from "@/lib/calendarDate";
import { WritingPayload } from "@/lib/types";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WritingFormProps {
  propertyId: number;
  documentId?: number; // edit this writing; without it the form creates a new one
  isReadOnly?: boolean;
}

interface FormData {
  writingNumber: number;
  voteNumberJDAAC: number;
  voteDateJDAAC: string;
  imageJDAAC?: string;
  voteNumberJDUA: number;
  voteDateJDUA: string;
  imageJDUA?: string;
  domain: string;
  folio: string;
  tomo: string;
  year: number;
  department: string;
  totalSurface: number;
  coveredSurface: number;
  improvementSurface: number;
  improvementValue: number;
  cadastralNomenclature: string;
  ubicationMap: string;
  cadastralInform: string;
  interiorImage?: string;
  exteriorImage?: string;
  actingNotary: string;
  notaryContact: number;
  formalities?: string;
  documentation?: string;
  detailSpaces?: string;
}

// Fields copied from GET /writing/:id into the form (dates are formatted apart).
const LOADED_FIELDS: (keyof FormData)[] = [
  "writingNumber",
  "voteNumberJDAAC",
  "imageJDAAC",
  "voteNumberJDUA",
  "imageJDUA",
  "domain",
  "folio",
  "tomo",
  "year",
  "department",
  "totalSurface",
  "coveredSurface",
  "improvementSurface",
  "improvementValue",
  "cadastralNomenclature",
  "ubicationMap",
  "cadastralInform",
  "interiorImage",
  "exteriorImage",
  "actingNotary",
  "notaryContact",
  "formalities",
  "documentation",
  "detailSpaces",
];

// Explicit field list, so nothing loaded into the form (id, property,
// timestamps) is echoed back: the Update DTO rejects unknown keys with 400.
const buildWritingPayload = (data: FormData): WritingPayload => ({
  writingNumber: Number(data.writingNumber),
  voteNumberJDAAC: Number(data.voteNumberJDAAC),
  voteDateJDAAC: data.voteDateJDAAC,
  imageJDAAC: data.imageJDAAC,
  voteNumberJDUA: Number(data.voteNumberJDUA),
  voteDateJDUA: data.voteDateJDUA,
  imageJDUA: data.imageJDUA,
  domain: data.domain ?? "",
  folio: data.folio ?? "",
  tomo: data.tomo ?? "",
  year: Number(data.year),
  department: data.department ?? "",
  totalSurface: Number(data.totalSurface),
  coveredSurface: Number(data.coveredSurface),
  improvementSurface: Number(data.improvementSurface),
  improvementValue: Number(data.improvementValue),
  cadastralNomenclature: data.cadastralNomenclature ?? "",
  ubicationMap: data.ubicationMap,
  cadastralInform: data.cadastralInform,
  actingNotary: data.actingNotary ?? "",
  notaryContact: Number(data.notaryContact),
  interiorImage: data.interiorImage,
  exteriorImage: data.exteriorImage,
  formalities: data.formalities ?? "",
  documentation: data.documentation ?? "",
  detailSpaces: data.detailSpaces ?? "",
});

const WritingForm = ({ propertyId, documentId, isReadOnly = false }: WritingFormProps) => {
  const router = useRouter();
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>();
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

        const url = await uploadImageToSupabase(file, `writings/property-${propertyId}`);
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
    reset({} as FormData);
    setImagePreviews({});

    // Without documentId the form stays empty: it creates a new writing.
    if (!documentId) return;
    let cancelled = false;

    const loadWriting = async () => {
      try {
        const writing: Partial<FormData> | undefined = await getWritingById(documentId);
        if (cancelled || !writing) return;

        LOADED_FIELDS.forEach((field) => {
          if (writing[field] !== undefined && writing[field] !== null) {
            setValue(field, writing[field]);
          }
        });

        setValue("voteDateJDAAC", toCalendarDate(writing.voteDateJDAAC));
        setValue("voteDateJDUA", toCalendarDate(writing.voteDateJDUA));

        setImagePreviews({
          imageJDAAC: resolveImageUrl(writing.imageJDAAC) || "",
          imageJDUA: resolveImageUrl(writing.imageJDUA) || "",
          interiorImage: resolveImageUrl(writing.interiorImage) || "",
          exteriorImage: resolveImageUrl(writing.exteriorImage) || "",
        });
      } catch (error) {
        if (cancelled) return;
        console.error("Error loading writing:", error);
        alert(`No se pudo cargar la escritura #${documentId}: ${extractApiErrorMessage(error)}`);
      }
    };

    loadWriting();
    return () => {
      cancelled = true;
    };
  }, [documentId, reset, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      if (!propertyId) {
        alert("No hay propiedad seleccionada. Volve a la lista y elegi una propiedad primero.");
        return;
      }

      setLoading(true);
      const payload = buildWritingPayload(data);
      if (documentId) {
        await updateWriting(documentId, payload);
      } else {
        await saveWriting({ ...payload, propertyId });
      }
      alert("Escritura guardada exitosamente");
      router.push(`/property/details?id=${propertyId}`);
    } catch (error) {
      console.error("Error saving writing:", error);
      alert(`Error al guardar la escritura: ${extractApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    const labels: Record<string, string> = {
      writingNumber: "Numero de escritura",
      voteNumberJDAAC: "Voto JD AAC",
      voteDateJDAAC: "Fecha de JD AAC",
      voteNumberJDUA: "Voto JD UA",
      voteDateJDUA: "Fecha de JD UA",
      domain: "Dominio",
      folio: "Folio",
      tomo: "Tomo",
      year: "Ano",
      department: "Departamento",
      totalSurface: "Superficie Total",
      coveredSurface: "Superficie Cubierta",
      improvementSurface: "Superficie Mejoras",
      improvementValue: "Valor Mejoras",
      cadastralNomenclature: "Nomenclatura Catastral",
      ubicationMap: "Ubicacion en Mapa",
      cadastralInform: "Informe Catastral",
      actingNotary: "Escribano Actuante",
      notaryContact: "Contacto Escribano",
    };

    alertMissingFields(formErrors as Record<string, unknown>, labels);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="doc-form w-full"
    >
      <fieldset disabled={isReadOnly} className="contents">
        <h1 className="doc-title">Formulario de Escritura</h1>
        <p className="doc-subtitle">Propiedad actual: #{propertyId || "sin seleccionar"}</p>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Información de Escritura</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <label htmlFor="writingNumber" className="block text-gray-300 mb-1">Número de escritura</label>
              <input id="writingNumber" type="number" className="doc-input" {...register("writingNumber", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.writingNumber && <p className="text-red-400 text-sm mt-1">{errors.writingNumber.message}</p>}
            </div>
            <div>
              <label htmlFor="voteNumberJDAAC" className="block text-gray-300 mb-1">Voto JD AAC</label>
              <input id="voteNumberJDAAC" type="number" className="doc-input" {...register("voteNumberJDAAC", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.voteNumberJDAAC && <p className="text-red-400 text-sm mt-1">{errors.voteNumberJDAAC.message}</p>}
            </div>
            <div>
              <label htmlFor="voteDateJDAAC" className="block text-gray-300 mb-1">Fecha de JD AAC</label>
              <input id="voteDateJDAAC" type="date" className="doc-input" {...register("voteDateJDAAC", { required: "Campo obligatorio" })} />
              {errors.voteDateJDAAC && <p className="text-red-400 text-sm mt-1">{errors.voteDateJDAAC.message}</p>}
            </div>
            <div>
              <label htmlFor="imageJDAAC" className="block text-gray-300 mb-1">Imagen JD AAC</label>
              <input id="imageJDAAC" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "imageJDAAC")} />
              {renderImagePreviewActions("imageJDAAC", "Imagen JD AAC")}
            </div>
            <div>
              <label htmlFor="voteNumberJDUA" className="block text-gray-300 mb-1">Voto JD UA</label>
              <input id="voteNumberJDUA" type="number" className="doc-input" {...register("voteNumberJDUA", { required: "Campo obligatorio", valueAsNumber: true })} />
              {errors.voteNumberJDUA && <p className="text-red-400 text-sm mt-1">{errors.voteNumberJDUA.message}</p>}
            </div>
            <div>
              <label htmlFor="voteDateJDUA" className="block text-gray-300 mb-1">Fecha de JD UA</label>
              <input id="voteDateJDUA" type="date" className="doc-input" {...register("voteDateJDUA", { required: "Campo obligatorio" })} />
              {errors.voteDateJDUA && <p className="text-red-400 text-sm mt-1">{errors.voteDateJDUA.message}</p>}
            </div>
            <div>
              <label htmlFor="imageJDUA" className="block text-gray-300 mb-1">Imagen JD UA</label>
              <input id="imageJDUA" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "imageJDUA")} />
              {renderImagePreviewActions("imageJDUA", "Imagen JD UA")}
            </div>
          </div>
        </fieldset>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Detalles Técnicos</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <label htmlFor="domain" className="block text-gray-300 mb-1">Dominio</label>
              <input id="domain" className="doc-input" {...register("domain")} />
            </div>
            <div>
              <label htmlFor="folio" className="block text-gray-300 mb-1">Folio</label>
              <input id="folio" className="doc-input" {...register("folio")} />
            </div>
            <div>
              <label htmlFor="tomo" className="block text-gray-300 mb-1">Tomo</label>
              <input id="tomo" className="doc-input" {...register("tomo")} />
            </div>
            <div>
              <label htmlFor="year" className="block text-gray-300 mb-1">Año</label>
              <input id="year" type="number" className="doc-input" {...register("year", { valueAsNumber: true })} />
            </div>
            <div>
              <label htmlFor="department" className="block text-gray-300 mb-1">Departamento</label>
              <input id="department" className="doc-input" {...register("department")} />
            </div>
            <div>
              <label htmlFor="totalSurface" className="block text-gray-300 mb-1">Superficie Total</label>
              <input id="totalSurface" type="number" className="doc-input" {...register("totalSurface", { valueAsNumber: true })} />
            </div>
            <div>
              <label htmlFor="coveredSurface" className="block text-gray-300 mb-1">Superficie Cubierta</label>
              <input id="coveredSurface" type="number" className="doc-input" {...register("coveredSurface", { valueAsNumber: true })} />
            </div>
            <div>
              <label htmlFor="improvementSurface" className="block text-gray-300 mb-1">Superficie Mejoras</label>
              <input id="improvementSurface" type="number" className="doc-input" {...register("improvementSurface", { valueAsNumber: true })} />
            </div>
            <div>
              <label htmlFor="improvementValue" className="block text-gray-300 mb-1">Valor Mejoras ($)</label>
              <input id="improvementValue" type="number" className="doc-input" {...register("improvementValue", { valueAsNumber: true })} />
            </div>
            <div>
              <label htmlFor="cadastralNomenclature" className="block text-gray-300 mb-1">Nomenclatura Catastral</label>
              <input id="cadastralNomenclature" className="doc-input" {...register("cadastralNomenclature")} />
            </div>
            <div>
              <label htmlFor="ubicationMap" className="block text-gray-300 mb-1">Ubicación en Mapa</label>
              <input id="ubicationMap" className="doc-input" {...register("ubicationMap")} />
            </div>
            <div>
              <label htmlFor="cadastralInform" className="block text-gray-300 mb-1">Informe Catastral</label>
              <input id="cadastralInform" className="doc-input" {...register("cadastralInform")} />
            </div>
          </div>
        </fieldset>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Imágenes de la Propiedad</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <label htmlFor="interiorImage" className="block text-gray-300 mb-1">Imagen Interior</label>
              <input id="interiorImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "interiorImage")} />
              {renderImagePreviewActions("interiorImage", "Interior")}
            </div>
            <div>
              <label htmlFor="exteriorImage" className="block text-gray-300 mb-1">Imagen Exterior</label>
              <input id="exteriorImage" type="file" accept="image/*" className="doc-input" onChange={(e) => handleImageUpload(e, "exteriorImage")} />
              {renderImagePreviewActions("exteriorImage", "Exterior")}
            </div>
          </div>
        </fieldset>

        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Datos Adicionales</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <div>
              <label htmlFor="actingNotary" className="block text-gray-300 mb-1">Escribano Actuante</label>
              <input id="actingNotary" className="doc-input" {...register("actingNotary")} />
            </div>
            <div>
              <label htmlFor="notaryContact" className="block text-gray-300 mb-1">Contacto Escribano</label>
              <input id="notaryContact" type="number" className="doc-input" {...register("notaryContact", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="formalities" className="block text-gray-300 mb-1">Trámites</label>
              <textarea id="formalities" className="doc-input" rows={3} {...register("formalities")} />
            </div>
            <div>
              <label htmlFor="documentation" className="block text-gray-300 mb-1">Documentación</label>
              <textarea id="documentation" className="doc-input" rows={3} {...register("documentation")} />
            </div>
            <div>
              <label htmlFor="detailSpaces" className="block text-gray-300 mb-1">Detalles Espacios</label>
              <textarea id="detailSpaces" className="doc-input" rows={3} {...register("detailSpaces")} />
            </div>
          </div>
        </fieldset>
      </fieldset>

      {!isReadOnly && (
        <button type="submit" disabled={loading} className="doc-submit-btn">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      )}
    </form>
  );
}

export default WritingForm;
