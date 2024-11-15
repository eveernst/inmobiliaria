import { useForm } from "react-hook-form";

export default function Escritura() {
  const { register } = useForm();

  return (
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
        <label htmlFor="escritura">Escritura</label>
        <input
          id="escritura"
          type="file"
          className="bg-gray-700 p-2 rounded w-full"
          {...register("escritura")}
        />
      </div>
    </>
  );
}
