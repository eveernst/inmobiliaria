import { saveInsurance } from "@/api/insuranceApi";
import { useForm, SubmitHandler } from "react-hook-form";

interface InsuranceFormProps {
  propertyId: number;
}

interface FormData {
  name: string;
  phone: number;
  email: string;
  insuredProperty: string;
  insuranceARM: boolean;
  insuranceASE: boolean;
  team: boolean;
  property: boolean;
  content: boolean;
  values: boolean;
  insuranceDate: string;
  AnualFormDate: string;
  observations: string;
  propertyId?: number;
}

const InsuranceForm = ({ propertyId }: InsuranceFormProps) => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Datos del formulario:", data);
    data.propertyId = propertyId;
    await saveInsurance(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Formulario de Seguro Inmueble</h1>
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Responsable del Seguro ARM</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <section>
            <label htmlFor="name" className="block text-gray-300 mb-1">Nombre completo</label>
            <input
              id="nombre-completo"
              type="text"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("name", { required: "Este campo es obligatorio" })}
            />
          </section>
          <section>
            <label htmlFor="telefono" className="block text-gray-300 mb-1">Teléfono</label>
            <input
              id="telefono"
              type="number"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("phone", { required: "Este campo es obligatorio" })}
            />
          </section>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Contacto</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <section>
            <label htmlFor="email" className="block text-gray-300 mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("email", { required: "Este campo es obligatorio" })}
            />
          </section>
          <section>
            <label htmlFor="bien-asegurado" className="block text-gray-300 mb-1">Bien asegurado</label>
            <select
              id="bien-asegurado"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("insuredProperty", { required: "Este campo es obligatorio" })}
            >
              <option value="">Seleccionar</option>
              <option value="option1">Templo</option>
              <option value="option2">Terreno</option>
              <option value="option2">Antena</option>
              <option value="option2">Casa</option>
              <option value="option2">Departamento</option>
              <option value="option2">Instituciones Educativas</option>
              <option value="option2">Predios</option>
              <option value="option2">Salon</option>
              <option value="option2">Tinglado</option>
              <option value="option2">Antena Interna</option>
              <option value="option2">Antena Externa</option>
            </select>
          </section>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Tipo de seguro que se registra</legend>
        <section>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <label className="block text-gray-300 mb-1">Responsabilidad Civil</label>
            <div className="flex flex-col">
              <label className="block text-gray-300 mb-1">
                <input type="checkbox" {...register("insuranceARM")} className="mr-2" />
                Aseguradora ARM
              </label>
              <label className="block text-gray-300 mb-1">
                <input type="checkbox" {...register("insuranceASE")} className="mr-2" />
                Aseguradora ART
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center w-full space-x-4">
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" {...register("team")} className="mr-2" />
              Equipo
            </label>
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" {...register("property")} className="mr-2" />
              Propiedades
            </label>
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" {...register("content")} className="mr-2" />
              Contenido
            </label>
            <label className="block text-gray-300 mb-1 flex-1 p-4">
              <input type="checkbox" {...register("values")} className="mr-2" />
              valores
            </label>
          </div>
        </section>
      </fieldset>
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Formulario del seguro</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label htmlFor="insuranceDate" className="block text-gray-300 mb-1">Fecha</label>
          <input
            id="insuranceDate"
            type="date"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("insuranceDate")}
          />
        </div>
      </fieldset>
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Formulario anual</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label htmlFor="AnualFormDate" className="block text-gray-300 mb-1">Fecha</label>
          <input
            id="AnualFormDate"
            type="date"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("AnualFormDate")}
          />
        </div>
      </fieldset>
      <fieldset className="border border-gray-600 rounded p-4">
        <section>
          <label htmlFor="observaciones" className="block text-gray-300 mb-1">Observaciones</label>
          <textarea
            id="observaciones"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("observations")}
          />
        </section>
      </fieldset>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Enviar
      </button>
    </form>
  );
};

export default InsuranceForm;
