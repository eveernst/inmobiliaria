'use client';

import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { saveWriting } from "@/api/writingApi";
import { getWriting } from "@/api/writingApi";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { useEffect, useState } from "react";

interface WritingFormProps {
  propertyId: number;
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
  propertyId?: number;
}

const WritingForm = ({ propertyId, isReadOnly = false }: WritingFormProps) => {
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  const formatDateForInput = (value: string | Date | null | undefined): string => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
          setValue(fieldName as any, url);
        } else {
          alert("No se pudo subir la imagen. Verifica que el bucket 'documents' exista y tenga acceso permitido.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (fieldName: keyof FormData) => {
    const currentUrl = getValues(fieldName as any) as string | undefined;

    if (currentUrl) {
      const deleted = await deleteImageByPublicUrl(currentUrl);
      if (!deleted) {
        alert("No se pudo eliminar la imagen en Supabase.");
        return;
      }
    }

    setValue(fieldName as any, null as any);
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

    const loadLatestWriting = async () => {
      if (!propertyId) return;

      try {
        const response = await getWriting();
        const allItems = Array.isArray(response) ? response : [];
        const propertyItems = allItems
          .filter((item: any) => item?.property?.id === propertyId || item?.propertyId === propertyId)
          .sort((a: any, b: any) => (b?.id || 0) - (a?.id || 0));

        const latest = propertyItems[0];
        if (!latest) return;

        const fieldsToSet: (keyof FormData)[] = [
          "writingNumber",
          "voteNumberJDAAC",
          "voteDateJDAAC",
          "imageJDAAC",
          "voteNumberJDUA",
          "voteDateJDUA",
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

        fieldsToSet.forEach((field) => {
          if (latest[field] !== undefined && latest[field] !== null) {
            setValue(field, latest[field]);
          }
        });

        setValue("voteDateJDAAC", formatDateForInput(latest.voteDateJDAAC));
        setValue("voteDateJDUA", formatDateForInput(latest.voteDateJDUA));

        setImagePreviews({
          imageJDAAC: resolveImageUrl(latest.imageJDAAC) || "",
          imageJDUA: resolveImageUrl(latest.imageJDUA) || "",
          interiorImage: resolveImageUrl(latest.interiorImage) || "",
          exteriorImage: resolveImageUrl(latest.exteriorImage) || "",
        });
      } catch (error) {
        console.error("Error loading latest writing:", error);
      }
    };

    loadLatestWriting();
  }, [propertyId, reset, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      if (!propertyId) {
        alert("No hay propiedad seleccionada. Volve a la lista y elegi una propiedad primero.");
        return;
      }

      setLoading(true);
      data.propertyId = propertyId;
      await saveWriting(data);
      alert("Escritura guardada exitosamente");
    } catch (error: any) {
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
