"use client";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { saveProperty, getProperties } from "../../api/porpertyApi";
import  PropertiesTable from "./PropertiesTable";
import { useEffect, useState } from "react";

interface InstallationData {
  file: string;
  quantity: number;
  name: string;
}

interface FormData {
  classification: number;
  address: string;
  destiny: string;
  detailsMaintenance: string;
  file: string;
  goodUseCode: number;
  description: string;
  province: string;
  locality: string;
  betweenStreets: string;
  postalCode: number;
  district: string;
  destinyUse: string;
  esActivo: boolean;
  // installations: InstallationData[];  
}

const NewProperty = () => {

  const [ properties, setProperties ] = useState<>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormData>(
    );
  

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getProperties();
      setProperties(resp) 
    } 
    fetchData();
  }, [])



  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // axios call to save data localhost:3000/property
    const resp = await saveProperty(data);

    // aniadir resp a la lista de propiedades

    console.log(resp);
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-orange-500 text-center mb-6">
          Nueva Propiedad
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código Bien de Uso */}
            <div className="flex flex-col">
              <input
                {...register("goodUseCode", { required: "Este campo es obligatorio", valueAsNumber: true })}
                type="number"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Código Bien de Uso"
              />
              {errors.goodUseCode && (
                <span className="text-red-500 text-sm mt-1">{errors.goodUseCode.message}</span>
              )}
            </div>
            {/* classificacion */}
            <div className="flex flex-col">
              <input
                {...register("classification", { required: "Este campo es obligatorio", valueAsNumber: true })}
                type="number"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Clasificacion"
              />
              {errors.classification && (
                <span className="text-red-500 text-sm mt-1">{errors.classification.message}</span>
              )}
            </div>

            {/* Dirección */}
            <div className="flex flex-col">
              <input
                {...register("address", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Dirección"
              />
              {errors.address && (
                <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
              )}
            </div>

            {/* Destino */}
            <div className="flex flex-col">
              <input
                {...register("destiny", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Destino"
              />
              {errors.destiny && (
                <span className="text-red-500 text-sm mt-1">{errors.destiny.message}</span>
              )}
            </div>

            {/* Detalles de Mantenimiento */}
            <div className="flex flex-col">
              <input
                {...register("detailsMaintenance", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Detalles de Mantenimiento"
              />
              {errors.detailsMaintenance && (
                <span className="text-red-500 text-sm mt-1">{errors.detailsMaintenance.message}</span>
              )}
            </div>

            {/* Archivo */}
            <div className="flex flex-col">
              <input
                {...register("file", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Archivo"
              />
              {errors.file && (
                <span className="text-red-500 text-sm mt-1">{errors.file.message}</span>
              )}
            </div>

            {/* Descripción */}
            <div className="flex flex-col">
              <input
                {...register("description", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Descripción"
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
              )}
            </div>

            {/* Provincia */}
            <div className="flex flex-col">
              <input
                {...register("province", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Provincia"
              />
              {errors.province && (
                <span className="text-red-500 text-sm mt-1">{errors.province.message}</span>
              )}
            </div>

            {/* Localidad */}
            <div className="flex flex-col">
              <input
                {...register("locality", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Localidad"
              />
              {errors.locality && (
                <span className="text-red-500 text-sm mt-1">{errors.locality.message}</span>
              )}
            </div>

            {/* Entre Calles */}
            <div className="flex flex-col">
              <input
                {...register("betweenStreets", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Entre Calles"
              />
              {errors.betweenStreets && (
                <span className="text-red-500 text-sm mt-1">{errors.betweenStreets.message}</span>
              )}
            </div>

            {/* Código Postal */}
            <div className="flex flex-col">
              <input
                {...register("postalCode", { required: "Este campo es obligatorio", valueAsNumber: true })}
                type="number"
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Código Postal"
              />
              {errors.postalCode && (
                <span className="text-red-500 text-sm mt-1">{errors.postalCode.message}</span>
              )}
            </div>

            {/* Distrito */}
            <div className="flex flex-col">
              <input
                {...register("district", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Distrito"
              />
              {errors.district && (
                <span className="text-red-500 text-sm mt-1">{errors.district.message}</span>
              )}
            </div>

            {/* Uso de Destino */}
            <div className="flex flex-col">
              <input
                {...register("destinyUse", { required: "Este campo es obligatorio" })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Uso de Destino"
              />
              {errors.destinyUse && (
                <span className="text-red-500 text-sm mt-1">{errors.destinyUse.message}</span>
              )}
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-700"
            >
              Guardar Propiedad
            </button>
          </div>
        </form>
      </div>
    {properties &&
      <PropertiesTable properties={properties} />
    }
    </>
  );
};

export default NewProperty;

