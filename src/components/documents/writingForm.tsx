import { useForm } from "react-hook-form";
import { saveWriting } from "@/api/writingApi";

export function Escritura() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Datos enviados:", data);
    await saveWriting(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6"
    >
      <h1 className="text-3xl font-bold text-white text-center mb-6">Formulario de Escritura</h1>
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Información de Escritura</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="writingNumber" className="block text-gray-300 mb-1">Número de escritura</label>
            <input
              id="writingNumber"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("writingNumber")}
            />
          </div>
          <div>
            <label htmlFor="voteNumberJDAAC" className="block text-gray-300 mb-1">Voto JD AAC</label>
            <input
              id="voteNumberJDAAC"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("voteNumberJDAAC")}
            />
          </div>
          <div>
            <label htmlFor="voteDateJDAAC" className="block text-gray-300 mb-1">Fecha de JD AAC</label>
            <input
              id="voteDateJDAAC"
              type="date"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("voteDateJDAAC")}
            />
          </div>
          <div>
            <label htmlFor="voteNumberJDUA" className="block text-gray-300 mb-1">Voto JD UA</label>
            <input
              id="voteNumberJDUA"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("voteNumberJDUA")}
            />
          </div>
          <div>
            <label htmlFor="voteDateJDUA" className="block text-gray-300 mb-1">Fecha de JD UA</label>
            <input
              id="voteDateJDUA"
              type="date"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("voteDateJDUA")}
            />
          </div>
        </div>
      </fieldset>

      {/* Detalles técnicos */}
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles Técnicos</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="domain" className="block text-gray-300 mb-1">Dominio</label>
            <input
              id="domain"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("domain")}
            />
          </div>
          <div>
            <label htmlFor="folio" className="block text-gray-300 mb-1">Folio</label>
            <input
              id="folio"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("folio")}
            />
          </div>
          <div>
            <label htmlFor="tomo" className="block text-gray-300 mb-1">Tomo</label>
            <input
              id="tomo"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("tomo")}
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-gray-300 mb-1">Año</label>
            <input
              id="year"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("year")}
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-gray-300 mb-1">Departamento</label>
            <input
              id="department"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("department")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="totalSurface" className="block text-gray-300 mb-1">Superficie Total</label>
            <input
              id="totalSurface"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("totalSurface")}
            />
          </div>
          <div>
            <label htmlFor="coveredSurface" className="block text-gray-300 mb-1">Superficie Cubierta</label>
            <input
              id="coveredSurface"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("coveredSurface")}
            />
          </div>
          <div>
            <label htmlFor="improvementSurface" className="block text-gray-300 mb-1">Superficie con mejoras</label>
            <input
              id="improvementSurface"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("improvementSurface")}
            />
          </div>
          <div>
            <label htmlFor="improvementValue" className="block text-gray-300 mb-1">Mejoras ($)</label>
            <input
              id="improvementValue"
              type="number"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("improvementValue")}
            />
          </div>
        </div>
      </fieldset>

      {/* Datos adicionales */}
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Datos Adicionales</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="cadastralNomenclature" className="block text-gray-300 mb-1">Nomenclatura catastral</label>
            <input
              id="cadastralNomenclature"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("cadastralNomenclature")}
            />
          </div>
          <div>
            <label htmlFor="ubicationMap" className="block text-gray-300 mb-1">Ubicacion en mapa</label>
            <input
              id="ubicationMap"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("ubicationMap")}
            />
          </div>
          <div>
            <label htmlFor="cadastralInform" className="block text-gray-300 mb-1">Informe catastral PDF</label>
            <input
              id="cadastralInform"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("cadastralInform")}
            />
          </div>
          <div>
            <label htmlFor="actingNotary" className="block text-gray-300 mb-1">Escribano Actuante</label>
            <input
              id="actingNotary"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("actingNotary")}
            />
          </div>
          <div>
            <label htmlFor="notaryContact" className="block text-gray-300 mb-1">Contacto del Escribano</label>
            <input
              id="notaryContact"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("notaryContact")}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 m-4">
          <div>
            <label htmlFor="formalities" className="block text-gray-300 mb-1">Trámites</label>
            <textarea
              id="formalities"
              className="bg-gray-700 p-2 rounded w-full"
              rows={4}
              {...register("formalities")}
            ></textarea>
          </div>
          <div>
            <label htmlFor="documentation" className="block text-gray-300 mb-1">Documentación</label>
            <textarea
              id="documentation"
              className="bg-gray-700 p-2 rounded w-full"
              rows={4}
              {...register("documentation")}
            ></textarea>
          </div>
          <div>
            <label htmlFor="detailSpaces" className="block text-gray-300 mb-1">Detalles Espacios</label>
            <textarea
              id="detailSpaces"
              className="bg-gray-700 p-2 rounded w-full"
              rows={4}
              {...register("detailSpaces")}
            ></textarea>
          </div>
        </div>
      </fieldset>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Enviar
      </button>
    </form>
  );
}

export default Escritura;
