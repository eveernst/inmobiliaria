import { useForm } from "react-hook-form";
import { savePlan } from "@/api/planApi";

const PlanoCasa = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Datos del formulario:", data);
    await savePlan(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6"> Formulario de Plano de Casa</h1>
      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles del Plano</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="generalPlan" className="block text-gray-300 mb-1">Plano General</label>
            <input type="checkbox" {...register("generalPlan")} id="generalPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="nro-plano" className="block text-gray-300 mb-1">N° de Plano</label>
            <input
              id="nro-plano"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("planNumber")}
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
            <label htmlFor="profesional" className="block text-gray-300 mb-1">Profesional</label>
            <input
              id="profesional"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("profesional")}
            />
          </div>
          <div>
            <label htmlFor="contactoProfesional" className="block text-gray-300 mb-1">Contacto del Profesional</label>
            <input
              id="contactoProfesional"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("professionalContact")}
            />
          </div>
        </section>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles de Visado y Planos</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="numberVisado" className="block text-gray-300 mb-1">Visado municipal</label>
            <input
              id="numberVisado"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("numberVisado")}
            />
          </div>
          <div>
            <label htmlFor="dateVisado" className="block text-gray-300 mb-1">Fecha visado</label>
            <input
              id="dateVisado"
              type="date"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("dateVisado")}
            />
          </div>
          <div>
            <label htmlFor="structurePlan" className="block text-gray-300 mb-1">Plano estructura</label>
            <input type="checkbox" {...register("structurePlan")} id="structurePlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="gasPlan" className="block text-gray-300 mb-1">Plano gas</label>
            <input type="checkbox" {...register("gasPlan")} id="gasPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="waterPlan" className="block text-gray-300 mb-1">Plano agua</label>
            <input type="checkbox" {...register("waterPlan")} id="waterPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="lightPlan" className="block text-gray-300 mb-1">Plano luz</label>
            <input type="checkbox" {...register("lightPlan")} id="lightPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="projectPlan" className="block text-gray-300 mb-1">Anteproyecto</label>
            <input type="checkbox" {...register("projectPlan")} id="projectPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="finalPlan" className="block text-gray-300 mb-1">Final de obra</label>
            <input type="checkbox" {...register("finalPlan")} id="finalPlan" className="mr-2" />
          </div>
        </section>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
      <legend className="text-lg font-semibold text-white px-2">Actualizacion</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="planType" className="block text-gray-300 mb-1">Tipo de plano</label>
            <select
              id="planType"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("planType", { required: "Este campo es obligatorio" })}
            >
              <option value="">Seleccionar</option>
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
            </select>
          </div>
          <div>
            <label htmlFor="planNumberUpdate" className="block text-gray-300 mb-1">N° de Plano</label>
            <input
              id="planNumberUpdate"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("planNumberUpdate")}
            />
          </div>
          <div>
            <label htmlFor="yearUpdate" className="block text-gray-300 mb-1">Año</label>
            <input
              id="yearUpdate"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("yearUpdate")}
            />
          </div>
          <div>
            <label htmlFor="formalities" className="block text-gray-300 mb-1">Formalidades</label>
            <input
              id="formalities"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("formalities")}
            />
          </div>
          <div>
            <label htmlFor="documentation" className="block text-gray-300 mb-1">Documentación</label>
            <input
              id="documentation"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("documentation")}
            />
          </div>
          <div>
            <label htmlFor="contacts" className="block text-gray-300 mb-1">Contactos</label>
            <input
              id="contacts"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("contacts")}
            />
          </div>
        </section>
      </fieldset>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Enviar
      </button>
    </form>
  );
};

export default PlanoCasa;