import { saveInsurance } from "@/api/insuranceApi";
import { getInsurance } from "@/api/insuranceApi";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { deleteImageByPublicUrl, resolveImageUrl, uploadImageToSupabase } from "@/lib/imageUpload";
import ImageViewModal from "@/components/ui/ImageViewModal";
import { alertMissingFields, extractApiErrorMessage } from "@/lib/formFeedback";
import { useEffect, useState } from "react";

interface InsuranceFormProps {
  propertyId: number;
  isReadOnly?: boolean;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  insuredProperty: string;
  insuranceARM: boolean;
  insuranceASE: boolean;
  team: boolean;
  content: boolean;
  values: boolean;
  insuranceDate?: string;
  insuranceImage?: string;
  AnualFormDate?: string;
  AnualFormImage?: string;
  observations: string;
  propertyId?: number;
}

const InsuranceForm = ({ propertyId, isReadOnly=false }: InsuranceFormProps) => {
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
        
        const url = await uploadImageToSupabase(file, `insurance/property-${propertyId}`);
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
          disabled={isReadOnly}
          onClick={() => handleRemoveImage(fieldName)}
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

    const loadLatestInsurance = async () => {
      if (!propertyId) return;

      try {
        const response = await getInsurance();
        const allItems = Array.isArray(response) ? response : [];
        const propertyItems = allItems
          .filter((item: any) => item?.property?.id === propertyId || item?.propertyId === propertyId)
          .sort((a: any, b: any) => (b?.id || 0) - (a?.id || 0));

        const latest = propertyItems[0];
        if (!latest) return;

        const fieldsToSet: (keyof FormData)[] = [
          "name",
          "phone",
          "email",
          "insuredProperty",
          "insuranceARM",
          "insuranceASE",
          "team",
          "content",
          "values",
          "insuranceImage",
          "observations",
        ];

        fieldsToSet.forEach((field) => {
          if (latest[field] !== undefined && latest[field] !== null) {
            setValue(field, field === "phone" ? String(latest[field]) : latest[field]);
          }
        });

        const annualFormImageValue = latest.anualFormImage || latest.AnualFormImage || "";
        setValue("insuranceDate", formatDateForInput(latest.insuranceDate));
        setValue("AnualFormDate", formatDateForInput(latest.AnualFormDate));

        if (annualFormImageValue) {
          setValue("AnualFormImage", annualFormImageValue);
        }

        setImagePreviews({
          insuranceImage: resolveImageUrl(latest.insuranceImage) || "",
          AnualFormImage: resolveImageUrl(annualFormImageValue) || "",
        });
      } catch (error) {
        console.error("Error loading latest insurance:", error);
      }
    };

    loadLatestInsurance();
  }, [propertyId, reset, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!propertyId) {
        alert("No hay propiedad seleccionada. Volve a la lista y elegi una propiedad primero.");
        return;
      }

      setLoading(true);
      console.log("Datos del formulario:", data);
      const payload = {
        ...data,
        propertyId,
        insuranceDate: data.insuranceDate?.trim() || undefined,
        AnualFormDate: data.AnualFormDate?.trim() || undefined,
      };

      await saveInsurance(payload);
      alert("Póliza de seguros guardada exitosamente");
    } catch (error: any) {
      console.error("Error saving insurance:", error);
      alert(`Error al guardar la póliza de seguros: ${extractApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: FieldErrors<FormData>) => {
    const labels: Record<string, string> = {
      name: "Nombre completo",
      phone: "Telefono",
      email: "E-mail",
      insuredProperty: "Bien asegurado",
    };

    alertMissingFields(formErrors as Record<string, unknown>, labels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="doc-form w-full">
      <h1 className="doc-title">Formulario de Seguro Inmueble</h1>
      <p className="doc-subtitle">Propiedad actual: #{propertyId || "sin seleccionar"}</p>
      <fieldset className="doc-fieldset">
        <legend className="doc-legend">Responsable del Seguro ARM</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <section>
            <label htmlFor="name" className="block text-gray-300 mb-1">Nombre completo</label>
            <input
              id="nombre-completo"
              type="text"
              className="doc-input"
              readOnly={isReadOnly}
              {...register("name", { required: "Este campo es obligatorio" })}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </section>
          <section>
            <label htmlFor="telefono" className="block text-gray-300 mb-1">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              inputMode="numeric"
              className="doc-input"
              readOnly={isReadOnly}
              {...register("phone", { required: "Este campo es obligatorio" })}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </section>
        </div>
      </fieldset>

      <fieldset className="doc-fieldset">
        <legend className="doc-legend">Contacto</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <section>
            <label htmlFor="email" className="block text-gray-300 mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              className="doc-input"
              readOnly={isReadOnly}
              {...register("email", { required: "Este campo es obligatorio" })}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </section>
          <section>
            <label htmlFor="bien-asegurado" className="block text-gray-300 mb-1">Bien asegurado</label>
            <select
              id="bien-asegurado"
              className="doc-input"
              disabled={isReadOnly}
              {...register("insuredProperty", { required: "Este campo es obligatorio" })}
            >
              <option value="">Seleccionar</option>
              <option value="Templo">Templo</option>
              <option value="Terreno">Terreno</option>
              <option value="Antena">Antena</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Instituciones Educativas">Instituciones Educativas</option>
              <option value="Predios">Predios</option>
              <option value="Salon">Salon</option>
              <option value="Tinglado">Tinglado</option>
              <option value="Antena Interna">Antena Interna</option>
              <option value="Antena Externa">Antena Externa</option>
            </select>
            {errors.insuredProperty && <p className="text-red-400 text-sm mt-1">{errors.insuredProperty.message}</p>}
          </section>
        </div>
      </fieldset>

      <fieldset className="doc-fieldset">
        <legend className="doc-legend">Tipo de seguro que se registra</legend>
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
            <label className="block text-gray-300 mb-1">Responsabilidad Civil</label>
            <div className="flex flex-col">
              <label className="block text-gray-300 mb-1">
                <input type="checkbox" disabled={isReadOnly} {...register("insuranceARM")} className="mr-2" />
                Aseguradora ARM
              </label>
              <label className="block text-gray-300 mb-1">
                <input type="checkbox" disabled={isReadOnly} {...register("insuranceASE")} className="mr-2" />
                Aseguradora ART
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center w-full space-x-4">
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" disabled={isReadOnly} {...register("team")} className="mr-2" />
              Equipo
            </label>
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" disabled={isReadOnly} {...register("content")} className="mr-2" />
              Contenido
            </label>
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" disabled={isReadOnly} {...register("values")} className="mr-2" />
              Valores
            </label>
          </div>
        </section>
      </fieldset>
      <fieldset className="doc-fieldset">
        <legend className="doc-legend">Formulario del seguro</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <div>
            <label htmlFor="insuranceDate" className="block text-gray-300 mb-1">Fecha</label>
            <input
              id="insuranceDate"
              type="date"
              className="doc-input"
              readOnly={isReadOnly}
              {...register("insuranceDate")}
            />
          </div>
          <div>
            <label htmlFor="insuranceImage" className="block text-gray-300 mb-1">Imagen de Póliza</label>
            <input id="insuranceImage" type="file" accept="image/*" className="doc-input" disabled={isReadOnly} onChange={(e) => handleImageUpload(e, "insuranceImage")} />
            {renderImagePreviewActions("insuranceImage", "Póliza")}
          </div>
        </div>
      </fieldset>
      <fieldset className="doc-fieldset">
        <legend className="doc-legend">Formulario anual</legend>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
          <div>
            <label htmlFor="AnualFormDate" className="block text-gray-300 mb-1">Fecha</label>
            <input
              id="AnualFormDate"
              type="date"
              className="doc-input"
              readOnly={isReadOnly}
              {...register("AnualFormDate")}
            />
          </div>
          <div>
            <label htmlFor="AnualFormImage" className="block text-gray-300 mb-1">Imagen de Formulario Anual</label>
            <input id="AnualFormImage" type="file" accept="image/*" className="doc-input" disabled={isReadOnly} onChange={(e) => handleImageUpload(e, "AnualFormImage")} />
            {renderImagePreviewActions("AnualFormImage", "Formulario Anual")}
          </div>
        </div>
      </fieldset>
      <fieldset className="doc-fieldset">
        <section>
          <label htmlFor="observaciones" className="block text-gray-300 mb-1">Observaciones</label>
          <textarea
            id="observaciones"
            className="doc-input"
            readOnly={isReadOnly}
            {...register("observations")}
          />
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

export default InsuranceForm;
