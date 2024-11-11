"use client"
import { saveProperty } from "@/api/porpertyApi";
import React from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

interface FormData {
  goodUseCode: number;
  classification: number;
  address: string;
  destiny: string;
  detailsMaintenance: string;
  file: File | null;
  description: string;
  province: string;
  locality: string;
  betweenStreets1: string;
  betweenStreets2: string;
  postalCode: number;
  district: string;
  destinyUse: string;
  isActive: boolean;
  installations: InstallationData[];
}

interface InstallationData {
  name: string;
  classification: string;
  quantity: number;
  file: File | null;
}

const NewProperty = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "installations"
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    await saveProperty(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-orange-500 text-center mb-6">Nueva Propiedad</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos del formulario como antes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aquí van los campos de la propiedad, como 'goodUseCode', 'classification', etc. */}
          {/* Campos del formulario como antes */}
          <div className="flex flex-col mb-4">
            <input
              {...register("goodUseCode", { required: "Este campo es obligatorio" })}
              type="number"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Código de Buen Uso"
            />
            {errors.goodUseCode && (
              <span className="text-red-500 text-sm mt-1">{errors.goodUseCode.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("classification", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Clasificación"
            />
            {errors.classification && (
              <span className="text-red-500 text-sm mt-1">{errors.classification.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("address", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Dirección"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("destiny", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Destino"
            />
            {errors.destiny && (
              <span className="text-red-500 text-sm mt-1">{errors.destiny.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("detailsMaintenance", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Detalles de Mantenimiento"
            />
            {errors.detailsMaintenance && (
              <span className="text-red-500 text-sm mt-1">{errors.detailsMaintenance.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("file")}
              type="file"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("description", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Descripción"
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("province", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Provincia"
            />
            {errors.province && (
              <span className="text-red-500 text-sm mt-1">{errors.province.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("locality", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Localidad"
            />
            {errors.locality && (
              <span className="text-red-500 text-sm mt-1">{errors.locality.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("betweenStreets1", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Entre Calles 1"
            />
            {errors.betweenStreets1 && (
              <span className="text-red-500 text-sm mt-1">{errors.betweenStreets1.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("betweenStreets2", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Entre Calles 2"
            />
            {errors.betweenStreets2 && (
              <span className="text-red-500 text-sm mt-1">{errors.betweenStreets2.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("postalCode", { required: "Este campo es obligatorio", valueAsNumber: true })}
              type="number"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Código Postal"
            />
            {errors.postalCode && (
              <span className="text-red-500 text-sm mt-1">{errors.postalCode.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("district", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Distrito"
            />
            {errors.district && (
              <span className="text-red-500 text-sm mt-1">{errors.district.message}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <input
              {...register("destinyUse", { required: "Este campo es obligatorio" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Uso de Destino"
            />
            {errors.destinyUse && (
              <span className="text-red-500 text-sm mt-1">{errors.destinyUse.message}</span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <input
              {...register("isActive")}
              type="checkbox"
              className="mr-2"
            />
            <label className="text-white">Activo</label>
          </div>

          {/* Instalaciones */}
          {fields.map((item, index) => (
            <div key={item.id} className="border p-4 mb-4 rounded-lg bg-gray-700">
              <h3 className="text-xl text-orange-500 mb-4">Instalación {index + 1}</h3>

              <div className="flex flex-col mb-4">
                <input
                  {...register(`installations[${index}].name`, { required: "Este campo es obligatorio" })}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nombre de la Instalación"
                />
                {errors.installations?.[index]?.name && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].name.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <input
                  {...register(`installations[${index}].classification`, { required: "Este campo es obligatorio" })}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Clasificación de Instalación"
                />
                {errors.installations?.[index]?.classification && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].classification.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <input
                  {...register(`installations[${index}].quantity`, { required: "Este campo es obligatorio", valueAsNumber: true })}
                  type="number"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Cantidad"
                />
                {errors.installations?.[index]?.quantity && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].quantity.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <input
                  {...register(`installations[${index}].file`)}
                  type="file"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Botón para eliminar instalación */}
              <button
                type="button"
                className="mt-4 text-red-500"
                onClick={() => remove(index)}
              >
                Eliminar Instalación
              </button>
            </div>
          ))}

          {/* Botón para agregar nueva instalación */}
          <button
            type="button"
            onClick={() => append({ name: "", classification: "", quantity: 0, file: null })}
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Agregar Instalación
          </button>
        </div>

        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="mt-6 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Guardar Propiedad
        </button>
      </form>
    </div>
  );
};

export default NewProperty;
