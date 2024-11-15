import { useForm } from "react-hook-form";
import { savePlan } from "@/api/planApi";

const PlanoCasa = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    console.log("Datos del formulario:", data);
    await savePlan(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset>
        <legend className="sr-only">Detalles del Plano</legend>
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="generalPlan">Plano General</label>
            <input type="checkbox" {...register("generalPlan")} id="generalPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="nro-plano">N° de Plano</label>
            <input
              id="nro-plano"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("planNumber")}
            />
          </div>
          <div>
            <label htmlFor="year">Año</label>
            <input
              id="year"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("year")}
            />
          </div>
        </section>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Información Profesional</legend>
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="profesional">Profesional</label>
            <input
              id="profesional"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("profesional")}
            />
          </div>
          <div>
            <label htmlFor="contactoProfesional">Contacto del Profesional</label>
            <input
              id="contactoProfesional"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("professionalContact")}
            />
          </div>
        </section>
      </fieldset>

      <fieldset>
        <legend>Detalles de Visado y Planos</legend>
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="numberVisado">Visado municipal</label>
            <input
              id="numberVisado"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("numberVisado")}
            />
          </div>
          <div>
            <label htmlFor="dateVisado">Fecha visado</label>
            <input
              id="dateVisado"
              type="date"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("dateVisado")}
            />
          </div>
          <div>
            <label htmlFor="structurePlan">Plano estructura</label>
            <input type="checkbox" {...register("structurePlan")} id="structurePlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="gasPlan">Plano gas</label>
            <input type="checkbox" {...register("gasPlan")} id="gasPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="waterPlan">Plano agua</label>
            <input type="checkbox" {...register("waterPlan")} id="waterPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="lightPlan">Plano luz</label>
            <input type="checkbox" {...register("lightPlan")} id="lightPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="projectPlan">Anteproyecto</label>
            <input type="checkbox" {...register("projectPlan")} id="projectPlan" className="mr-2" />
          </div>
          <div>
            <label htmlFor="finalPlan">Final de obra</label>
            <input type="checkbox" {...register("finalPlan")} id="finalPlan" className="mr-2" />
          </div>
        </section>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Actualización de Plano</legend>
        <section className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="planType">Tipo de plano</label>
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
            <label htmlFor="planNumberUpdate">N° de Plano</label>
            <input
              id="planNumberUpdate"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("planNumberUpdate")}
            />
          </div>
          <div>
            <label htmlFor="yearUpdate">Año</label>
            <input
              id="yearUpdate"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("yearUpdate")}
            />
          </div>
          <div>
            <label htmlFor="formalities">Formalidades</label>
            <input
              id="formalities"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("formalities")}
            />
          </div>
          <div>
            <label htmlFor="documentation">Documentación</label>
            <input
              id="documentation"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("documentation")}
            />
          </div>
          <div>
            <label htmlFor="contacts">Contactos</label>
            <input
              id="contacts"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("contacts")}
            />
          </div>
        </section>
      </fieldset>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
        Enviar Formulario
      </button>
    </form>
  );
};

export default PlanoCasa;


