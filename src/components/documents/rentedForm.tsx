"use client";

import React, { useState } from "react";
import { useForm, FieldError, Path, SubmitHandler } from "react-hook-form";
import { saveRented, updateRented, getRentedById } from "@/api/rentedApi";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { toCalendarDate } from "@/lib/calendarDate";
import { RentedPayload } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RentedFormProps {
  propertyId: number;
  documentId?: number; // edit this rented record; without it the form creates a new one
  isReadOnly?: boolean;
}

interface FormData {
  ownerDetails: string;
  affectation: string;
  ownerContact: string;
  renterDetails: string;
  address: string;
  renterContact: string;
  locality: string;
  contratStartDate?: string;
  province: string;
  contratEndDate?: string;
  price?: number;
  adjustmentType?: string;
  contractImage?: string;
}

// Fields copied from GET /rented/:id into the form (dates are formatted apart).
const LOADED_FIELDS: (keyof FormData)[] = [
  "ownerDetails",
  "affectation",
  "ownerContact",
  "renterDetails",
  "address",
  "renterContact",
  "locality",
  "province",
  "price",
  "adjustmentType",
  "contractImage",
];

// Explicit field list, so nothing loaded into the form (id, property,
// timestamps) is echoed back: the Update DTO rejects unknown keys with 400.
// An empty number input yields NaN; it is omitted instead of sent as null.
const buildRentedPayload = (data: FormData): RentedPayload => {
  const price = Number(data.price);

  return {
    ownerDetails: data.ownerDetails ?? "",
    affectation: data.affectation,
    ownerContact: data.ownerContact ?? "",
    renterDetails: data.renterDetails ?? "",
    address: data.address ?? "",
    renterContact: data.renterContact ?? "",
    locality: data.locality ?? "",
    contratStartDate: data.contratStartDate?.trim() || undefined,
    contratEndDate: data.contratEndDate?.trim() || undefined,
    province: data.province,
    price: Number.isFinite(price) ? price : undefined,
    adjustmentType: data.adjustmentType ?? "",
    contractImage: data.contractImage,
  };
};

const RentedForm = ({ propertyId, documentId, isReadOnly = false }: RentedFormProps) => {
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

        const url = await uploadImageToSupabase(file, `rented/property-${propertyId}`);
        if (url) {
          setValue(fieldName as Path<FormData>, url);
        } else {
          alert("No se pudo subir la imagen. Verifica que el bucket 'documents' exista y tenga acceso permitido.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (fieldName: string) => {
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

  useEffect(() => {
    reset({} as FormData);
    setImagePreviews({});

    // Without documentId the form stays empty: it creates a new rented record.
    if (!documentId) return;
    let cancelled = false;

    const loadRented = async () => {
      try {
        const rented: Partial<FormData> | undefined = await getRentedById(documentId);
        if (cancelled || !rented) return;

        LOADED_FIELDS.forEach((field) => {
          if (rented[field] !== undefined && rented[field] !== null) {
            setValue(field, rented[field]);
          }
        });

        setValue("contratStartDate", toCalendarDate(rented.contratStartDate));
        setValue("contratEndDate", toCalendarDate(rented.contratEndDate));

        setImagePreviews({
          contractImage: resolveImageUrl(rented.contractImage) || "",
        });
      } catch (error) {
        if (cancelled) return;
        console.error("Error loading rented:", error);
        alert(`No se pudo cargar el alquiler #${documentId}: ${extractApiErrorMessage(error)}`);
      }
    };

    loadRented();
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
      const payload = buildRentedPayload(data);
      if (documentId) {
        await updateRented(documentId, payload);
      } else {
        await saveRented({ ...payload, propertyId });
      }
      alert("Inmueble alquilado guardado exitosamente");
      router.push(`/property/details?id=${propertyId}`);
    } catch (error) {
      console.error("Error saving rented property:", error);
      alert(`Error al guardar el inmueble alquilado: ${extractApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      ownerDetails: "Datos del propietario",
      ownerContact: "Contacto del propietario",
      renterDetails: "Datos del inquilino",
      address: "Dirección",
      renterContact: "Contacto del inquilino",
      locality: "Localidad",
      contratStartDate: "Fecha de comienzo",
      contratEndDate: "Fecha de finalización",
      price: "Monto ($)",
      affectation: "Afectacion",
      province: "Provincia",
    };

    alertMissingFields(formErrors, labels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="doc-form w-full">
      <fieldset disabled={isReadOnly} className="contents">
        <h1 className="doc-title">Formulario de Inmueble Alquilado</h1>
        <p className="doc-subtitle">Propiedad actual: #{propertyId || "sin seleccionar"}</p>
        <section>
          <fieldset className="doc-fieldset">
            <legend className="doc-legend">Datos del Propietario</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div>
                <label htmlFor="ownerDetails" className="block text-gray-300 mb-1">Datos del propietario</label>
                <input
                  id="ownerDetails"
                  className="doc-input"
                  {...register("ownerDetails", { required: "Este campo es obligatorio" })}
                />
                {errors.ownerDetails && (
                  <p className="text-red-500 text-sm">{(errors.ownerDetails as FieldError).message}</p>
                )}
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
                  {...register("ownerContact", { required: "Este campo es obligatorio" })}
                />
                {errors.ownerContact && (
                  <p className="text-red-500 text-sm">{(errors.ownerContact as FieldError).message}</p>
                )}
              </div>
            </div>
          </fieldset>
        </section>

        <section>
          <fieldset className="doc-fieldset">
            <legend className="doc-legend">Datos del Inquilino</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div>
                <label htmlFor="renterDetails" className="block text-gray-300 mb-1">Datos del inquilino</label>
                <input
                  id="renterDetails"
                  className="doc-input"
                  {...register("renterDetails", { required: "Este campo es obligatorio" })}
                />
                {errors.renterDetails && (
                  <p className="text-red-500 text-sm">{(errors.renterDetails as FieldError).message}</p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-300 mb-1">Dirección</label>
                <input
                  id="address"
                  className="doc-input"
                  {...register("address", { required: "Este campo es obligatorio" })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{(errors.address as FieldError).message}</p>
                )}
              </div>
              <div>
                <label htmlFor="renterContact" className="block text-gray-300 mb-1">Contacto del inquilino</label>
                <input
                  id="renterContact"
                  className="doc-input"
                  {...register("renterContact", { required: "Este campo es obligatorio" })}
                />
                {errors.renterContact && (
                  <p className="text-red-500 text-sm">{(errors.renterContact as FieldError).message}</p>
                )}
              </div>
              <div>
                <label htmlFor="locality" className="block text-gray-300 mb-1">Localidad</label>
                <input
                  id="locality"
                  className="doc-input"
                  {...register("locality", { required: "Este campo es obligatorio" })}
                />
                {errors.locality && (
                  <p className="text-red-500 text-sm">{(errors.locality as FieldError).message}</p>
                )}
              </div>
            </div>
          </fieldset>
        </section>

        <section>
          <fieldset className="doc-fieldset">
            <legend className="doc-legend">Detalles del Contrato</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div>
                <label htmlFor="contratStartDate" className="block text-gray-300 mb-1">Fecha de comienzo</label>
                <input
                  id="contratStartDate"
                  type="date"
                  className="doc-input"
                  {...register("contratStartDate", { required: "Este campo es obligatorio" })}
                />
                {errors.contratStartDate && (
                  <p className="text-red-500 text-sm">{(errors.contratStartDate as FieldError).message}</p>
                )}
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
                  {...register("contratEndDate", { required: "Este campo es obligatorio" })}
                />
                {errors.contratEndDate && (
                  <p className="text-red-500 text-sm">{(errors.contratEndDate as FieldError).message}</p>
                )}
              </div>
            </div>
          </fieldset>
        </section>

        <section>
          <fieldset className="doc-fieldset">
            <legend className="doc-legend">Detalles Financieros</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
              <div>
                <label htmlFor="price" className="block text-gray-300 mb-1">Monto ($)</label>
                <input
                  id="price"
                  type="number"
                  className="doc-input"
                  {...register("price", { required: "Este campo es obligatorio", valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{(errors.price as FieldError).message}</p>
                )}
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
                      disabled={isReadOnly}
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
      </fieldset>

      {!isReadOnly && (
        <button type="submit" disabled={loading} className="doc-submit-btn">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      )}
    </form>
  );
};

export default RentedForm;
