"use client"
import { saveProperty, editProperty, getProperty } from "@/api/propertyApi";
import { getClassifications } from "@/api/classificationApi";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { resolveImageUrl } from "@/lib/imageUpload";
import ImageViewModal from "@/components/ui/ImageViewModal";
import React, { useRef, useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray, Path } from "react-hook-form";

type ImageFieldValue = File | string | null;

interface FormData {
  goodUseCode: number;
  // innerImage: string | null;
  // outerImage: string | null;
  file: ImageFieldValue;
  province: string;
  locality: string;
  address: string;
  postalCode: number;
  betweenStreets1: string;
  betweenStreets2: string;
  district: string;
  destiny: string;
  state: number;
  active: boolean;
  clfc: string; // seria un number para elegir pero en la api esta como string
  detailsMaintenance: string;
  description: string;
  user: number;
  classification: number;
  installations: {
    name: string;
    quantity: number;
    file: ImageFieldValue;
    details: string;
    classification: number;
  }[];
  id?: number;
}

interface ClassificationOption {
  id: number;
  name: string;
}

interface RawInstallation {
  file?: string;
  classification?: number | { id: number };
  [field: string]: unknown;
}

const PropertyForm = ({ id }: { id?: number }) => {

  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "installations"
  });

  const [title, setTitle] = useState<string>("Nueva Propiedad");
  const [classifications, setClassifications] = useState<ClassificationOption[]>([]);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const submittingLockRef = useRef(false);
  const lastCreatedFingerprintRef = useRef<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setImagePreviews((prev) => ({ ...prev, [fieldName]: preview }));
      setImageErrors((prev) => ({ ...prev, [fieldName]: false }));
      setValue(fieldName as Path<FormData>, file, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (fieldName: string) => {
    setValue(fieldName as Path<FormData>, "", { shouldDirty: true });
    setImagePreviews((prev) => ({ ...prev, [fieldName]: "" }));
    setImageErrors((prev) => ({ ...prev, [fieldName]: false }));
  };

  const handleRemoveInstallation = (indexToRemove: number) => {
    remove(indexToRemove);
    setImagePreviews((prev) => {
      const nextPreviews: Record<string, string> = {};

      Object.entries(prev).forEach(([key, value]) => {
        const match = key.match(/^installations\.(\d+)\.file$/);

        if (!match) {
          nextPreviews[key] = value;
          return;
        }

        const currentIndex = Number(match[1]);
        if (currentIndex < indexToRemove) {
          nextPreviews[key] = value;
          return;
        }

        if (currentIndex > indexToRemove) {
          nextPreviews[`installations.${currentIndex - 1}.file`] = value;
        }
      });

      return nextPreviews;
    });
  };

  const renderImagePreviewActions = (fieldName: string, imageName: string) => {
    const imageUrl = resolveImageUrl(imagePreviews[fieldName]);
    if (!imageUrl) return null;

    return (
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
        {!imageErrors[fieldName] ? (
          <img
            src={imageUrl}
            alt={imageName}
            className="h-auto w-40 rounded border border-gray-600"
            onError={() => setImageErrors((prev) => ({ ...prev, [fieldName]: true }))}
          />
        ) : (
          <div className="rounded border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Imagen no disponible
          </div>
        )}
        <button
          type="button"
          onClick={() => handleRemoveImage(fieldName)}
          className="inline-flex items-center justify-center rounded-lg bg-slate-700 px-3 py-2 text-white hover:bg-slate-600"
          title="Eliminar imagen"
        >
          <span aria-hidden="true">X</span>
        </button>
        <ImageViewModal imageUrl={imageUrl} imageName={imageName} />
      </div>
    );
  };

  useEffect(() => {
    async function fetchProperty() {
      if (id === undefined || id === 0) return;
      try {
        const data = await getProperty(id);
        console.log(data);

        const safeInstallations = Array.isArray(data?.installations) ? data.installations : [];
        const processedData = {
          ...data,
          file: data?.file ?? data?.planImage ?? "",
          installations: safeInstallations.map((inst: RawInstallation) => ({
            ...inst,
            classification:
              typeof inst?.classification === "object"
                ? inst.classification?.id
                : inst?.classification,
          })),
        };

        reset(processedData);

        if (data?.classification?.id) {
          setValue("classification", data.classification.id);
        }

        const mainImage = resolveImageUrl(data?.file ?? data?.planImage ?? "") || "";
        const previews: Record<string, string> = {
          file: mainImage,
        };

        safeInstallations.forEach((inst: RawInstallation, index: number) => {
          previews[`installations.${index}.file`] = resolveImageUrl(inst?.file) || "";
        });

        setImagePreviews(previews);
      } catch (error) {
        console.error("Error cargando propiedad para edición:", error);
      }
      
    }
    fetchProperty();
  }, [id, reset, setValue]);

  useEffect(() => {
    async function fetchClassifications() {
      try {
        const data = await getClassifications();
        setClassifications(data || []);
      } catch (error) {
        setClassifications([]);
      }
    }

    fetchClassifications();
  }, []);

  // useEffect precargará los datos de la propiedad si se está editando
  useEffect(() => {
    if (id !== undefined && id !== 0) {
      setTitle("Editar Propiedad");
      console.log("Cargando propiedad con id:", id);

    } else {
      setTitle("Nueva Propiedad");
      console.log("Creando nueva propiedad");
    }
  }, [id]);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSaving || submittingLockRef.current) {
      return;
    }

    try {
      submittingLockRef.current = true;
      setIsSaving(true);
      setSaveMessage("Validando datos y preparando guardado...");
      console.log("id de propiedad", id);

      const normalizeFileValue = (value: ImageFieldValue) => {
        if (value instanceof File) {
          return value.size ? value : "";
        }

        if (typeof value === "string") {
          return value;
        }

        return "";
      };

      const processedData = {
        ...data,
        file: normalizeFileValue(data.file),
        installations: (data.installations || []).map(inst => ({
          ...inst,
          file: normalizeFileValue(inst.file),
        })),
      };

      const creationFingerprint = JSON.stringify(processedData);
      console.log("Datos a enviar:", processedData);

      if (id !== undefined && id !== 0) {
        setSaveMessage("Guardando cambios de la propiedad...");
        processedData.id = id;
        await editProperty(processedData);
        setSaveMessage("Propiedad actualizada correctamente.");
        alert("Propiedad actualizada exitosamente");
      } else {
        if (lastCreatedFingerprintRef.current === creationFingerprint) {
          setSaveMessage("Esta propiedad ya fue creada. Cambiá algún dato antes de volver a guardar.");
          alert("Esta propiedad ya fue guardada. Evitamos un guardado duplicado.");
          return;
        }

        setSaveMessage("Creando nueva propiedad...");
        await saveProperty(processedData);
        lastCreatedFingerprintRef.current = creationFingerprint;
        setSaveMessage("Propiedad creada correctamente.");
        alert("Propiedad guardada exitosamente");
      }
    } catch (error) {
      console.error("Error saving property:", error);
      setSaveMessage("No se pudo guardar la propiedad.");
      alert(`Error al guardar la propiedad: ${extractApiErrorMessage(error)}`);
    } finally {
      setIsSaving(false);
      submittingLockRef.current = false;
    }
  };

  const onInvalid = (formErrors: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      goodUseCode: "Codigo de Buen Uso",
      description: "Descripcion",
      classification: "Clasificacion",
      province: "Provincia",
      locality: "Localidad",
      address: "Direccion",
      postalCode: "Codigo Postal",
      betweenStreets1: "Entre Calles 1",
      betweenStreets2: "Entre Calles 2",
      district: "Distrito",
      detailsMaintenance: "Detalles",
      destiny: "Destino",
      clfc: "CLFC",
      state: "Estado",
    };

    alertMissingFields(formErrors, labels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-6xl mx-auto space-y-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-8">
      <h1 className="text-3xl font-semibold text-slate-100 text-center mb-6">{title}</h1>
      {/* Campos del formulario como antes */}
      <fieldset className="rounded-xl border border-slate-700 p-5 bg-slate-950/30">
        <legend className="text-base font-semibold text-slate-200 px-2">Detalles de la Propiedad</legend>

        {/* Código de Buen Uso */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="goodUseCode" className="block text-slate-300 mb-1 text-sm">Código de Buen Uso</label>
            <input
              id="goodUseCode"
              {...register("goodUseCode", { required: "Este campo es obligatorio" })}
              type="number"
              className="doc-input"
            />
            {errors.goodUseCode && (
              <span className="text-red-500 text-sm mt-1">{errors.goodUseCode.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-slate-300 mb-1 text-sm">Descripcion</label>
            <input
              id="description"
              {...register("description", { required: "Este campo es obligatorio" })}
              type="string"
              className="doc-input"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
            )}
          </div>

          {/* Archivo */}
          <div>
            <label htmlFor="file" className="block text-slate-300 mb-1 text-sm">Cargar Archivo</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              className="doc-input"
              onChange={(e) => handleImageUpload(e, "file")}
            />
            {renderImagePreviewActions("file", "Imagen de la propiedad")}
          </div>

          {/* Clasificación */}
          <div>
            <label htmlFor="classification" className="block text-slate-300 mb-1 text-sm">Clasificación</label>
            <select
              id="classification"
              {...register("classification", {
                required: "Este campo es obligatorio",
                valueAsNumber: true,
              })}
              className="doc-input"
            >
              <option value="" hidden>Seleccionar clasificación</option>
              {classifications.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} (ID: {option.id})
                </option>
              ))}
            </select>
            {errors.classification && (
              <span className="text-red-500 text-sm mt-1">{errors.classification.message}</span>
            )}
          </div>

          {/* Provincia */}
          <div>
            <label htmlFor="province" className="block text-slate-300 mb-1 text-sm">Provincia</label>
            <select
              id="province"
              {...register("province", { required: "Este campo es obligatorio" })}
              className="doc-input"
            >
              <option value="" hidden>Provincia</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Entre Ríos">Entre Ríos</option>
              <option value="Santa Fe">Santa Fe</option>
            </select>
            {errors.province && (
              <span className="text-red-500 text-sm mt-1">{errors.province.message}</span>
            )}
          </div>

          {/* Localidad */}
          <div>
            <label htmlFor="locality" className="block text-slate-300 mb-1 text-sm">Localidad</label>
            <input
              id="locality"
              {...register("locality", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.locality && (
              <span className="text-red-500 text-sm mt-1">{errors.locality.message}</span>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-slate-300 mb-1 text-sm">Dirección</label>
            <input
              id="address"
              {...register("address", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
            )}
          </div>

          {/* Código Postal */}
          <div>
            <label htmlFor="postalCode" className="block text-slate-300 mb-1 text-sm">Código Postal</label>
            <input
              id="postalCode"
              {...register("postalCode", { required: "Este campo es obligatorio", valueAsNumber: true })}
              type="number"
              className="doc-input"
            />
            {errors.postalCode && (
              <span className="text-red-500 text-sm mt-1">{errors.postalCode.message}</span>
            )}
          </div>

          {/* Entre Calles 1 */}
          <div>
            <label htmlFor="betweenStreets1" className="block text-slate-300 mb-1 text-sm">Entre Calles 1</label>
            <input
              id="betweenStreets1"
              {...register("betweenStreets1", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.betweenStreets1 && (
              <span className="text-red-500 text-sm mt-1">{errors.betweenStreets1.message}</span>
            )}
          </div>

          {/* Entre Calles 2 */}
          <div>
            <label htmlFor="betweenStreets2" className="block text-slate-300 mb-1 text-sm">Entre Calles 2</label>
            <input
              id="betweenStreets2"
              {...register("betweenStreets2", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.betweenStreets2 && (
              <span className="text-red-500 text-sm mt-1">{errors.betweenStreets2.message}</span>
            )}
          </div>

          {/* Distrito */}
          <div>
            <label htmlFor="district" className="block text-slate-300 mb-1 text-sm">Distrito</label>
            <input
              id="district"
              {...register("district", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.district && (
              <span className="text-red-500 text-sm mt-1">{errors.district.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="active" className="block text-slate-300 mb-1 text-sm">Activo</label>
            <input type="checkbox" {...register("active")} id="generalPlan" className="mr-2" />
            {errors.active && (
              <span className="text-red-500 text-sm mt-1">{errors.active.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="detailsMaintenance" className="block text-slate-300 mb-1 text-sm">Detalles</label>
            <input type="text-area"
              id="detailsMaintenance"
              {...register("detailsMaintenance", { required: "Este campo es obligatorio" })}
              className="doc-input"
            />
            {errors.detailsMaintenance && (
              <span className="text-red-500 text-sm mt-1">{errors.detailsMaintenance.message}</span>
            )}
          </div>

          {/* Destino */}
          <div>
            <label htmlFor="destiny" className="block text-slate-300 mb-1 text-sm">Destino</label>
            <select
              id="destiny"
              {...register("destiny", { required: "Este campo es obligatorio" })}
              className="bg-gray-700 p-2 rounded w-full"
            >
              <option value="" hidden>Destino</option>
              <option value="0">Templo</option>
              <option value="1">Terreno</option>
              <option value="2">Antena</option>
              <option value="3">Casa</option>
              <option value="4">Departamento</option>
              <option value="5">Instituciones Educativas</option>
              <option value="6">Predio</option>
              <option value="7">Otro</option>
            </select>
            {errors.destiny && (
              <span className="text-red-500 text-sm mt-1">{errors.destiny.message}</span>
            )}
          </div>

          {/* CLFC */}
          <div>
            <label htmlFor="clfc" className="block text-slate-300 mb-1 text-sm">CLFC</label>
            <select
              id="clfc"
              {...register("clfc", { required: "Este campo es obligatorio" })}
              className="doc-input"
            >
              <option value="" hidden>CLFC</option>
              <option value="0">Sí</option>
              <option value="1">Solicitar</option>
              <option value="2">Solicitado</option>
              <option value="3">No</option>
            </select>
            {errors.clfc && (
              <span className="text-red-500 text-sm mt-1">{errors.clfc.message}</span>
            )}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="state" className="block text-slate-300 mb-1 text-sm">Estado</label>
            <select
              id="state"
              {...register("state", { required: "Este campo es obligatorio" })}
              className="doc-input"
            >
              <option value="" hidden>Estado</option>
              <option value="0">Disponible</option>
              <option value="1">Alquilado</option>
            </select>
            {errors.state && (
              <span className="text-red-500 text-sm mt-1">{errors.state.message}</span>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-700 p-5 bg-slate-950/30">
        {/* Instalaciones */}
        {fields.map((item, index) => (
          <div key={item.id} >
            <h3 className="text-3xl font-bold text-white text-center mb-4">Instalación {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="name" className="block text-slate-300 mb-1 text-sm">Nombre de instalacion</label>
                <input
                  {...register(`installations.${index}.name`, { required: "Este campo es obligatorio" })}
                  className="doc-input"
                />
                {errors.installations?.[index]?.name && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].name.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="classification" className="block text-slate-300 mb-1 text-sm">Clasificacion</label>
                <input
                  type="number"
                  {...register(`installations.${index}.classification`, { required: "Este campo es obligatorio", valueAsNumber: true })} // Se agrega valueAsNumber para que el valor sea un número
                  className="doc-input"
                />
                {errors.installations?.[index]?.classification && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].classification.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="quantity" className="block text-slate-300 mb-1 text-sm">Cantidad</label>
                <input
                  {...register(`installations.${index}.quantity`, { required: "Este campo es obligatorio", valueAsNumber: true })}
                  type="number"
                  className="doc-input"
                />
                {errors.installations?.[index]?.quantity && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].quantity.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="file" className="block text-slate-300 mb-1 text-sm">Archivo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="doc-input"
                  onChange={(e) => handleImageUpload(e, `installations.${index}.file`)}
                />
                {renderImagePreviewActions(`installations.${index}.file`, `Instalación ${index + 1}`)}
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="details" className="block text-slate-300 mb-1 text-sm">Detalles</label>
                <textarea
                  {...register(`installations.${index}.details`, { required: "Este campo es obligatorio" })}
                  className="doc-input"
                ></textarea>
                {errors.installations?.[index]?.details && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].details.message}</span>
                )}
              </div>

              {/* Botón para eliminar instalación */}
              <button
                type="button"
                onClick={() => handleRemoveInstallation(index)}
                className="w-full h-10 rounded-lg bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-500 mt-10"
              >
                Eliminar Instalación
              </button>
            </div>
          </div>
        ))}
      </fieldset>

      {/* Botón para agregar nueva instalación */}
      <button
        type="button"
        onClick={() => append({ name: "", classification: 0, quantity: 0, file: "", details: "" })}
        className="w-fullrounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-500"
      >
        Agregar Instalación
      </button>

      {/* Botón para enviar el formulario */}
      {saveMessage && (
        <div className="rounded-md border border-slate-600 bg-slate-900/70 px-4 py-3 text-center text-sm text-slate-200">
          {saveMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Guardando..." : "Guardar Propiedad"}
      </button>
    </form>
  );
};

export default PropertyForm;

