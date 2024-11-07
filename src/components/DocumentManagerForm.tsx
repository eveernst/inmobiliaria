"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function PropertyDocumentManager() {
  const { 
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<any>();
  const [activeTab, setActiveTab] = useState("seguro-inmueble");

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 container mx-auto p-4">
      <div className="bg-gray-800 border-gray-700 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Nueva Documentación</h1>
        <div className="tabs">
          <div className="flex mb-4 space-x-4">
            <button
              className={`tab-btn ${activeTab === "seguro-inmueble" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveTab("seguro-inmueble")}
            >
              Seguro inmueble
            </button>
            <button
              className={`tab-btn ${activeTab === "inmueble-alquilado" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveTab("inmueble-alquilado")}
            >
              Inmueble alquilado
            </button>
            <button
              className={`tab-btn ${activeTab === "plano-casa" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveTab("plano-casa")}
            >
              Plano de casa
            </button>
            <button
              className={`tab-btn ${activeTab === "escritura" ? "bg-gray-700" : ""}`}
              onClick={() => setActiveTab("escritura")}
            >
              Escritura
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {activeTab === "seguro-inmueble" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre-completo">Nombre completo</label>
                    <input
                      id="nombre-completo"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("nombreCompleto", { required: "Este campo es obligatorio" })}
                    />
                    {/* {errors.nombreCompleto && <p className="text-red-500">{errors.nombreCompleto.message}</p>} */}
                  </div>
                  <div>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      id="telefono"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("telefono", { required: "Este campo es obligatorio" })}
                    />
                    {/* {errors.telefono && <p className="text-red-500">{errors.telefono.message}</p>} */}
                  </div>
                </div>

                <div>
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("email", { required: "Este campo es obligatorio" })}
                  />
                  {/* {errors.email && <p className="text-red-500">{errors.email.message}</p>} */}
                </div>

                <div>
                  <label htmlFor="bien-asegurado">Bien asegurado</label>
                  <select
                    id="bien-asegurado"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("bienAsegurado", { required: "Este campo es obligatorio" })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="option1">Opción 1</option>
                    <option value="option2">Opción 2</option>
                  </select>
                  {/* {errors.bienAsegurado && <p className="text-red-500">{errors.bienAsegurado.message}</p>} */}
                </div>

                <div>
                  <label>Tipo de seguro que se registra</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="checkbox" {...register("responsabilidadCivil")} className="mr-2" />
                      Responsabilidad Civil
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" {...register("aseguradoraARM")} className="mr-2" />
                      Aseguradora ARM
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" {...register("aseguradoraART")} className="mr-2" />
                      Aseguradora ART
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="observaciones">Observaciones</label>
                  <textarea
                    id="observaciones"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("observaciones")}
                  />
                </div>
              </>
            )}

            {activeTab === "inmueble-alquilado" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="datos-propietario">Datos del propietario</label>
                    <input
                      id="datos-propietario"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("datosPropietario")}
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-propietario">Contacto</label>
                    <input
                      id="contacto-propietario"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("contactoPropietario")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="datos-inquilino">Datos del inquilino</label>
                    <input
                      id="datos-inquilino"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("datosInquilino")}
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-inquilino">Contacto</label>
                    <input
                      id="contacto-inquilino"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("contactoInquilino")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fecha-comienzo">Fecha de comienzo del contrato</label>
                    <input
                      id="fecha-comienzo"
                      type="date"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("fechaComienzo")}
                    />
                  </div>
                  <div>
                    <label htmlFor="fecha-finalizacion">Fecha de finalización del contrato</label>
                    <input
                      id="fecha-finalizacion"
                      type="date"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("fechaFinalizacion")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="monto">Monto $</label>
                    <input
                      id="monto"
                      type="number"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("monto")}
                    />
                  </div>
                  <div>
                    <label htmlFor="tipo-ajuste">Tipo de ajuste</label>
                    <input
                      id="tipo-ajuste"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("tipoAjuste")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contrato">Contrato</label>
                  <input
                    id="contrato"
                    type="file"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("contrato")}
                  />
                </div>
              </>
            )}

            {activeTab === "plano-casa" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="plano-general">Plano General</label>
                    <input
                      id="plano-general"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("planoGeneral")}
                    />
                  </div>
                  <div>
                    <label htmlFor="nro-plano">N° de Plano</label>
                    <input
                      id="nro-plano"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("nroPlano")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profesional">Profesional</label>
                    <input
                      id="profesional"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("profesional")}
                    />
                  </div>
                  <div>
                    <label htmlFor="matricula">Matrícula</label>
                    <input
                      id="matricula"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("matricula")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="colegio-profesional">Colegio Profesional</label>
                    <input
                      id="colegio-profesional"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("colegioProfesional")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="plano">Plano</label>
                  <input
                    id="plano"
                    type="file"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("plano")}
                  />
                </div>
              </>
            )}

            {activeTab === "escritura" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fecha-escritura">Fecha Escritura</label>
                    <input
                      id="fecha-escritura"
                      type="date"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("fechaEscritura")}
                    />
                  </div>
                  <div>
                    <label htmlFor="voto-aac">Voto JD AAC</label>
                    <input
                      id="voto-aac"
                      className="bg-gray-700 p-2 rounded w-full"
                      {...register("votoAAC")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="documento">Documento</label>
                  <input
                    id="documento"
                    type="file"
                    className="bg-gray-700 p-2 rounded w-full"
                    {...register("documento")}
                  />
                </div>
              </>
            )}

            <button type="submit" className="bg-blue-500 p-2 rounded text-white">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
