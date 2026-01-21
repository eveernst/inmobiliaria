"use client"
import { saveProperty, editProperty, getProperty } from "@/api/propertyApi";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Trash2, Plus, X } from "lucide-react";
import InsuranceForm from "../documents/insuranceForm";
import RentedForm from "../documents/rentedForm";
import WritingForm from "../documents/writingForm";
import PlanForm from "../documents/planForm";

interface FormData {
  goodUseCode: number;
  // innerImage: string | null;
  // outerImage: string | null;
  file: File | null;
  province: string;
  locality: string;
  address: string;
  postalCode: number;
  betweenStreets1: string;
  betweenStreets2: string;
  district: string;
  destiny: number;
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
    file: File | null;
    details: string;
    classification: number;
  }[];
  id?: number;
}

const PropertyForm = ({ id }: any) => {

  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm<FormData>({
    defaultValues: {
      installations: [],
      active: true,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "installations"
  });

  const [title, setTitle] = useState<string>("Nueva Propiedad");

  useEffect(() => {
    async function fetchProperty() {
      if (id === undefined || id === 0) return;
      const data = await getProperty(id);
      console.log(data);
      const processedData = {
        ...data,
        installations: data.installations?.map((inst: any) => ({
          ...inst,
          classification: inst.classification.id
        }))
      }
      reset(processedData);
      setValue("classification", data.classification.id);

    }
    fetchProperty();
  }, [id]);

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


  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log("id de propiedad", id);

    // Preprocesamiento de datos antes de enviarlos
    const processedData = {
      ...data,
      file: data.file?.size ? data.file : null, // Asigna archivo si tiene tamaño, de lo contrario null
      installations: data.installations?.map((inst: any) => ({
        ...inst,
        file: inst.file?.size ? inst.file : null, // Igual para las instalaciones
      })),
    };
    console.log("Datos a enviar:", processedData);

    // Manejo de la lógica de `id`
    if (id !== undefined && id !== 0) {
      processedData.id = id; // Si existe `id` y no es 0, se asigna al objeto
      await editProperty(processedData); // Llamada para editar propiedad
    } else {
      await saveProperty(processedData); // Llamada para guardar nueva propiedad
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-500">Completa todos los detalles de la propiedad</p>
        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            Detalles Principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Código de Buen Uso */}
            <div>
              <label htmlFor="goodUseCode" className="block text-sm font-semibold text-slate-700 mb-2">Código de Buen Uso</label>
              <input
                id="goodUseCode"
                {...register("goodUseCode", { required: "Este campo es obligatorio" })}
                type="number"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.goodUseCode && <span className="text-red-500 text-sm mt-1">{errors.goodUseCode.message}</span>}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">Descripción</label>
              <input
                id="description"
                {...register("description", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>}
            </div>


            {/* Clasificación */}
            <div>
              <label htmlFor="classification" className="block text-sm font-semibold text-slate-700 mb-2">Clasificación</label>
              <input
                type="number"
                id="classification"
                {...register("classification", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.classification && <span className="text-red-500 text-sm mt-1">{errors.classification.message}</span>}
            </div>

            {/* Provincia */}
            <div>
              <label htmlFor="province" className="block text-sm font-semibold text-slate-700 mb-2">Provincia</label>
              <select
                id="province"
                {...register("province", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar provincia</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Entre Ríos">Entre Ríos</option>
                <option value="Santa Fe">Santa Fe</option>
              </select>
              {errors.province && <span className="text-red-500 text-sm mt-1">{errors.province.message}</span>}
            </div>

            {/* Localidad */}
            <div>
              <label htmlFor="locality" className="block text-sm font-semibold text-slate-700 mb-2">Localidad</label>
              <input
                id="locality"
                {...register("locality", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.locality && <span className="text-red-500 text-sm mt-1">{errors.locality.message}</span>}
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">Dirección</label>
              <input
                id="address"
                {...register("address", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>}
            </div>

            {/* Código Postal */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-slate-700 mb-2">Código Postal</label>
              <input
                id="postalCode"
                {...register("postalCode", { required: "Este campo es obligatorio", valueAsNumber: true })}
                type="number"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.postalCode && <span className="text-red-500 text-sm mt-1">{errors.postalCode.message}</span>}
            </div>

            {/* Entre Calles 1 */}
            <div>
              <label htmlFor="betweenStreets1" className="block text-sm font-semibold text-slate-700 mb-2">Entre Calles 1</label>
              <input
                id="betweenStreets1"
                {...register("betweenStreets1", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.betweenStreets1 && <span className="text-red-500 text-sm mt-1">{errors.betweenStreets1.message}</span>}
            </div>

            {/* Entre Calles 2 */}
            <div>
              <label htmlFor="betweenStreets2" className="block text-sm font-semibold text-slate-700 mb-2">Entre Calles 2</label>
              <input
                id="betweenStreets2"
                {...register("betweenStreets2", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.betweenStreets2 && <span className="text-red-500 text-sm mt-1">{errors.betweenStreets2.message}</span>}
            </div>

            {/* Distrito */}
            <div>
              <label htmlFor="district" className="block text-sm font-semibold text-slate-700 mb-2">Distrito</label>
              <input
                id="district"
                {...register("district", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.district && (
                <span className="text-red-500 text-sm mt-1">{errors.district.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="active" className="block text-sm font-semibold text-slate-700 mb-2">Activo</label>
              <input type="checkbox" {...register("active")} id="generalPlan" className="" />
              {errors.active && (
                <span className="text-red-500 text-sm mt-1">{errors.active.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="detailsMaintenance" className="block text-sm font-semibold text-slate-700 mb-2">Detalles</label>
              <input type="text-area"
                id="detailsMaintenance"
                {...register("detailsMaintenance", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.detailsMaintenance && (
                <span className="text-red-500 text-sm mt-1">{errors.detailsMaintenance.message}</span>
              )}
            </div>

            {/* Destino */}
            <div>
              <label htmlFor="destiny" className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Inmueble</label>
              <select
                id="destiny"
                {...register("destiny", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" hidden>Seleccionar tipo</option>
                <option value="0">Templo</option>
                <option value="1">Terreno</option>
                <option value="2">Antena</option>
                <option value="3">Casa</option>
                <option value="4">Departamento</option>
                <option value="5">Instituciones Educativas</option>
                <option value="6">Predio</option>
                <option value="7">Otro</option>
              </select>
              {errors.destiny && <span className="text-red-500 text-sm mt-1">{errors.destiny.message}</span>}
            </div>

            {/* CLFC */}
            <div>
              <label htmlFor="clfc" className="block text-sm font-semibold text-slate-700 mb-2">CLFC</label>
              <select
                id="clfc"
                {...register("clfc", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="0">Sí</option>
                <option value="1">Solicitar</option>
                <option value="2">Solicitado</option>
                <option value="3">No</option>
              </select>
              {errors.clfc && <span className="text-red-500 text-sm mt-1">{errors.clfc.message}</span>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
              <select
                id="state"
                {...register("state", { required: "Este campo es obligatorio" })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar estado</option>
                <option value="0">Disponible</option>
                <option value="1">Alquilado</option>
              </select>
              {errors.state && <span className="text-red-500 text-sm mt-1">{errors.state.message}</span>}
            </div>

            {/* Archivo */}
            <div>
              <label htmlFor="file" className="block text-sm font-semibold text-slate-700 mb-2">Cargar Archivo</label>
              <input
                id="file"
                {...register("file")}
                type="file"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Detalles de Mantenimiento */}
            <div className="lg:col-span-2">
              <label htmlFor="detailsMaintenance" className="block text-sm font-semibold text-slate-700 mb-2">Detalles de Mantenimiento</label>
              <textarea
                id="detailsMaintenance"
                {...register("detailsMaintenance", { required: "Este campo es obligatorio" })}
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.detailsMaintenance && <span className="text-red-500 text-sm mt-1">{errors.detailsMaintenance.message}</span>}
            </div>

            {/* Activo Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("active")}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-semibold text-slate-700">Activo</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      <fieldset className="border border-gray-600 rounded p-4">
        {/* Instalaciones */}
        {fields.map((item, index) => (
          <div key={item.id} >
            <h3 className="text-3xl font-bold text-white text-center mb-4">Instalación {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1">Nombre de instalacion</label>
                <input
                  {...register(`installations[${index}].name`, { required: "Este campo es obligatorio" })}
                  className="bg-gray-700 p-2 rounded w-full"
                />
                {errors.installations?.[index]?.name && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].name.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="classification" className="block text-gray-300 mb-1">Clasificacion</label>
                <input
                  type="number"
                  {...register(`installations[${index}].classification`, { required: "Este campo es obligatorio", valueAsNumber: true })} // Se agrega valueAsNumber para que el valor sea un número
                  className="bg-gray-700 p-2 rounded w-full"
                />
                {errors.installations?.[index]?.classification && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].classification.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="quantity" className="block text-gray-300 mb-1">Cantidad</label>
                <input
                  {...register(`installations[${index}].quantity`, { required: "Este campo es obligatorio", valueAsNumber: true })}
                  type="number"
                  className="bg-gray-700 p-2 rounded w-full"
                />
                {errors.installations?.[index]?.quantity && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].quantity.message}</span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="file" className="block text-gray-300 mb-1">Archivo</label>
                <input
                  {...register(`installations[${index}].file`)}
                  type="file"
                  className="bg-gray-700 p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="details" className="block text-gray-300 mb-1">Detalles</label>
                <textarea
                  {...register(`installations[${index}].details`, { required: "Este campo es obligatorio" })}
                  className="bg-gray-700 p-2 rounded w-full"
                ></textarea>
                {errors.installations?.[index]?.details && (
                  <span className="text-red-500 text-sm mt-1">{errors.installations[index].details.message}</span>
                )}
              </div>


              {/* Botón para eliminar instalación */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="w-full h-10 bg-blue-800 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors mt-10"
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
        onClick={() => append({ name: "", classification: 0, quantity: 0, file: null, details: "", property: 0 })}
        className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Agregar Instalación
      </button>

      {/* Botón para enviar el formulario */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Guardar Propiedad
      </button>
    </form >
  );
};

export default PropertyForm;

let _isEditing = false;
export function setIsEditing(value: boolean): void {
  _isEditing = value;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("property_isEditing", JSON.stringify(value));
    } catch {
      // ignore sessionStorage errors
    }
  }
}
