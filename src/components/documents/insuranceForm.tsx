import { saveInsurance } from "@/api/insuranceApi";
import { useForm } from "react-hook-form";

const SeguroInmueble = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Datos del formulario:", data);
    await saveInsurance(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset className="grid grid-cols-2 gap-4">
        <legend className="sr-only">Información Personal</legend>
        
        <section>
          <label htmlFor="name">Nombre completo</label>
          <input
            id="nombre-completo"
            type="text"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("name", { required: "Este campo es obligatorio" })}
          />
        </section>

        <section>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("phone", { required: "Este campo es obligatorio" })}
          />
        </section>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Contacto</legend>

        <section>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("email", { required: "Este campo es obligatorio" })}
          />
        </section>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Información del Seguro</legend>

        <section>
          <label htmlFor="bien-asegurado">Bien asegurado</label>
          <select
            id="bien-asegurado"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("insuredProperty", { required: "Este campo es obligatorio" })}
          >
            <option value="">Seleccionar</option>
            <option value="option1">Opción 1</option>
            <option value="option2">Opción 2</option>
          </select>
        </section>

        <section>
          <label>Tipo de seguro que se registra</label>
          <label htmlFor="">Responsabilidad Civil</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input type="checkbox" {...register("insuranceARM")} className="mr-2" />
              Aseguradora ARM
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("insuranceASE")} className="mr-2" />
              Aseguradora ART
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("team")} className="mr-2" />
              Equipo
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("property")} className="mr-2" />
              Propiedades
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("content")} className="mr-2" />
              Contenido
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("values")} className="mr-2" />
              valores
            </label>
          </div>
        </section>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Observaciones</legend>

        <section>
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("observations")}
          />
        </section>
      </fieldset>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Enviar Formulario
      </button>
    </form>
  );
};

export default SeguroInmueble;
