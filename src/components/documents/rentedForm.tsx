import React from "react";
import { useForm, FieldError } from "react-hook-form";
import { saveRented } from "@/api/rentedApi";

const RentedForm = (propertyId : any) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Formulario enviado:", data);
    data.propertyId = propertyId;
    await saveRented(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Formulario de Inmueble Alquilado</h1>
      <section>
        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-lg font-semibold text-white px-2">Datos del Propietario</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="ownerDetails" className="block text-gray-300 mb-1">Datos del propietario</label>
              <input
                id="ownerDetails"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("ownerDetails")}
              />
            </div>
            <div>
              <label htmlFor="affectation" className="block text-gray-300 mb-1">Afectación</label>
              <select
                id="affectation"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("affectation", { required: "Este campo es obligatorio" })}
              >
                <option value="">Seleccionar</option>
                <option value="option1">Opción 1</option>
                <option value="option2">Opción 2</option>
              </select>
              {errors.affectation && (
                <p className="text-red-500 text-sm">{(errors.affectation as FieldError).message}</p>
              )}
            </div>
            <div>
              <label htmlFor="ownerContact" className="block text-gray-300 mb-1">Contacto del propietario</label>
              <input
                id="ownerContact"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("ownerContact")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Datos del Inquilino</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="renterDetails" className="block text-gray-300 mb-1">Datos del inquilino</label>
              <input
                id="renterDetails"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("renterDetails")}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-300 mb-1">Dirección</label>
              <input
                id="address"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("address")}
              />
            </div>
            <div>
              <label htmlFor="renterContact" className="block text-gray-300 mb-1">Contacto del inquilino</label>
              <input
                id="renterContact"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("renterContact")}
              />
            </div>
            <div>
              <label htmlFor="locality" className="block text-gray-300 mb-1">Localidad</label>
              <input
                id="locality"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("locality")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles del Contrato</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="contratStartDate" className="block text-gray-300 mb-1">Fecha de comienzo</label>
              <input
                id="contratStartDate"
                type="date"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("contratStartDate")}
              />
            </div>
            <div>
              <label htmlFor="province" className="block text-gray-300 mb-1">Provincia</label>
              <select
                id="province"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("province", { required: "Este campo es obligatorio" })}
              >
                <option value="">Seleccionar</option>
                <option value="option1">Opción 1</option>
                <option value="option2">Opción 2</option>
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
                className="bg-gray-700 p-2 rounded w-full"
                {...register("contratEndDate")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles Financieros</legend>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="price" className="block text-gray-300 mb-1">Monto ($)</label>
              <input
                id="price"
                type="number"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("price")}
              />
            </div>
            <div>
              <label htmlFor="adjustmentType" className="block text-gray-300 mb-1">Tipo de ajuste</label>
              <input
                id="adjustmentType"
                className="bg-gray-700 p-2 rounded w-full"
                {...register("adjustmentType")}
              />
            </div>
          </div>
        </fieldset>
      </section>

      <section>
        <fieldset className="border border-gray-600 rounded p-4">
          <legend className="text-lg font-semibold text-white px-2">Archivos Adjuntos</legend>
          {/* <div>
            <label htmlFor="contractImage">Contrato</label>
            <input
              id="contractImage"
              type="file"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("contractImage")}
            />
          </div> */}
        </fieldset>
      </section>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Enviar
      </button>
    </form>
  );
};

export default RentedForm;
