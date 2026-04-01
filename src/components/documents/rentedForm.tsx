import React, { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { saveRented } from "@/api/rentedApi";
import { getRented } from "@/api/rentedApi";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { useEffect } from "react";

const RentedForm = ({ propertyId }: any) => {
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();
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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const preview = reader.result as string;
        setImagePreviews((prev) => ({ ...prev, [fieldName]: preview }));
        
        const url = await uploadImageToSupabase(file, `rented/property-${propertyId}`);
        if (url) {
          setValue(fieldName as any, url);
        } else {
          alert("No se pudo subir la imagen. Verifica que el bucket 'documents' exista y tenga acceso permitido.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (fieldName: string) => {
    const currentUrl = getValues(fieldName) as string | undefined;

    if (currentUrl) {
      const deleted = await deleteImageByPublicUrl(currentUrl);
      if (!deleted) {
        alert("No se pudo eliminar la imagen en Supabase.");
        return;
      }
    }

    setValue(fieldName, null);
    setImagePreviews((prev) => ({ ...prev, [fieldName]: "" }));
  };

  useEffect(() => {
    reset({});
    setImagePreviews({});

    const loadLatestRented = async () => {
      if (!propertyId) return;

      try {
        const response = await getRented();
        const allItems = Array.isArray(response) ? response : [];
        const propertyItems = allItems
          .filter((item: any) => item?.property?.id === propertyId || item?.propertyId === propertyId)
          .sort((a: any, b: any) => (b?.id || 0) - (a?.id || 0));

        const latest = propertyItems[0];
        if (!latest) return;

        const fields = [
          "ownerDetails",
          "affectation",
          "ownerContact",
          "renterDetails",
          "address",
          "renterContact",
          "locality",
          "contratStartDate",
          "province",
          "contratEndDate",
          "price",
          "adjustmentType",
          "contractImage",
        ];

        fields.forEach((field) => {
          if (latest[field] !== undefined && latest[field] !== null) {
            setValue(field as any, latest[field]);
          }
        });

        setValue("contratStartDate", formatDateForInput(latest.contratStartDate));
        setValue("contratEndDate", formatDateForInput(latest.contratEndDate));

        setImagePreviews({
          contractImage: resolveImageUrl(latest.contractImage) || "",
        });
      } catch (error) {
        console.error("Error loading latest rented:", error);
      }
    };

    loadLatestRented();
  }, [propertyId, reset, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log("Formulario enviado:", data);
      data.propertyId = propertyId;
      await saveRented(data);
      alert("Inmueble alquilado guardado exitosamente");
    } catch (error: any) {
      console.error("Error saving rented property:", error);
      alert(`Error al guardar el inmueble alquilado: ${extractApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      affectation: "Afectacion",
      province: "Provincia",
    };

    alertMissingFields(formErrors, labels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="doc-form">
      <h1 className="doc-title">Formulario de Inmueble Alquilado</h1>
      <p className="doc-subtitle">Propiedad actual: #{propertyId || "sin seleccionar"}</p>
      <section>
        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Datos del Propietario</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="ownerDetails" className="block text-gray-300 mb-1">Datos del propietario</label>
              <input
                id="ownerDetails"
                className="doc-input"
                {...register("ownerDetails")}
              />
            </div>
            <div>
              <label htmlFor="affectation" className="block text-gray-300 mb-1">Afectación</label>
              <select
                id="affectation"
                className="doc-input"
                {...register("affectation", { required: "Este campo es obligatorio" })}
              >
                <option value="">Seleccionar</option>
                <option value="Habitacional">Habitacional</option>
                <option value="Templo">Templo</option>
                <option value="Comercial">Comercial</option>
              </select>
              {errors.affectation && (
                <p className="text-red-500 text-sm">{(errors.affectation as FieldError).message}</p>
              )}
            </div>
            <div>
              <label htmlFor="ownerContact" className="block text-gray-300 mb-1">Contacto del propietario</label>
              <input
                id="ownerContact"
                className="doc-input"
                {...register("ownerContact")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Datos del Inquilino</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="renterDetails" className="block text-gray-300 mb-1">Datos del inquilino</label>
              <input
                id="renterDetails"
                className="doc-input"
                {...register("renterDetails")}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-300 mb-1">Dirección</label>
              <input
                id="address"
                className="doc-input"
                {...register("address")}
              />
            </div>
            <div>
              <label htmlFor="renterContact" className="block text-gray-300 mb-1">Contacto del inquilino</label>
              <input
                id="renterContact"
                className="doc-input"
                {...register("renterContact")}
              />
            </div>
            <div>
              <label htmlFor="locality" className="block text-gray-300 mb-1">Localidad</label>
              <input
                id="locality"
                className="doc-input"
                {...register("locality")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Detalles del Contrato</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="contratStartDate" className="block text-gray-300 mb-1">Fecha de comienzo</label>
              <input
                id="contratStartDate"
                type="date"
                className="doc-input"
                {...register("contratStartDate")}
              />
            </div>
            <div>
              <label htmlFor="province" className="block text-gray-300 mb-1">Provincia</label>
              <select
                id="province"
                className="doc-input"
                {...register("province", { required: "Este campo es obligatorio" })}
              >
                <option value="">Seleccionar</option>
                <option value="Cordoba">Cordoba</option>
                <option value="Entre Rios">Entre Rios</option>
                <option value="Santa Fe">Santa Fe</option>
              </select>
              {errors.province && (
                <p className="text-red-500 text-sm">{(errors.province as FieldError).message}</p>
              )}
            </div>
            <div>
              <label htmlFor="contratEndDate" className="block text-gray-300 mb-1">Fecha de finalización</label>
              <input
                id="contratEndDate"
                type="date"
                className="doc-input"
                {...register("contratEndDate")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Detalles Financieros</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="price" className="block text-gray-300 mb-1">Monto ($)</label>
              <input
                id="price"
                type="number"
                className="doc-input"
                {...register("price", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label htmlFor="adjustmentType" className="block text-gray-300 mb-1">Tipo de ajuste</label>
              <input
                id="adjustmentType"
                className="doc-input"
                {...register("adjustmentType")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="doc-fieldset">
          <legend className="doc-legend">Archivos Adjuntos</legend>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label htmlFor="contractImage" className="block text-gray-300 mb-1">Imagen de Contrato</label>
              <input
                id="contractImage"
                type="file"
                accept="image/*"
                className="doc-input"
                onChange={(e) => handleImageUpload(e, "contractImage")}
              />
              {imagePreviews.contractImage && (
                <div className="doc-preview-card">
                  <img src={resolveImageUrl(imagePreviews.contractImage)} alt="Preview" className="h-auto w-40 rounded border border-gray-600" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("contractImage")}
                    className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    title="Eliminar imagen"
                  >
                    <span aria-hidden="true">🗑</span>
                  </button>
                  <ImageViewModal imageUrl={imagePreviews.contractImage} imageName="Contrato" />
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </section>

      <button type="submit" disabled={loading} className="doc-submit-btn">
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};

export default RentedForm;
