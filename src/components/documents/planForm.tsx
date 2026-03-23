'use client';
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { savePlan, uploadPlanFile } from "@/api/planApi";

interface PlanFormProps {
  propertyId: number;
}

interface FormData {
  generalPlan: boolean;
  planNumber: string;
  year: number;
  profesional: string;
  professionalContact: string;
  numberVisado: string;
  dateVisado: string;
  structurePlan: boolean;
  gasPlan: boolean;
  waterPlan: boolean;
  lightPlan: boolean;
  projectPlan: boolean;
  finalPlan: boolean;
  planType: string;
  planNumberUpdate: string;
  yearUpdate: number;
  formalities: string;
  documentation: string;
  contacts: string;
}

const PlanForm = ({ propertyId }: PlanFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await savePlan(propertyId, data);
      if (pdfFile) {
        await uploadPlanFile(propertyId, pdfFile);
      }
      setStatus('success');
      reset();
      setPdfFile(null);
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.response?.data?.message || 'Error al guardar el plano');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Formulario de Plano de Casa</h1>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles del Plano</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="generalPlan" {...register("generalPlan")} className="mr-2" />
            <label htmlFor="generalPlan" className="text-gray-300">Plano General</label>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">N° de Plano</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("planNumber")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Año</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("year", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Profesional</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("profesional")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Contacto del Profesional</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("professionalContact")} />
          </div>
        </section>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Visado y Tipos de Plano</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Visado municipal</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("numberVisado")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Fecha visado</label>
            <input type="date" className="bg-gray-700 p-2 rounded w-full" {...register("dateVisado")} />
          </div>
          {[
            { field: "structurePlan", label: "Plano estructura" },
            { field: "gasPlan", label: "Plano gas" },
            { field: "waterPlan", label: "Plano agua" },
            { field: "lightPlan", label: "Plano luz" },
            { field: "projectPlan", label: "Anteproyecto" },
            { field: "finalPlan", label: "Final de obra" },
          ].map(({ field, label }) => (
            <div key={field} className="flex items-center gap-2">
              <input type="checkbox" id={field} {...register(field as any)} className="mr-2" />
              <label htmlFor={field} className="text-gray-300">{label}</label>
            </div>
          ))}
        </section>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Actualización</legend>
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Tipo de plano</label>
            <select className="bg-gray-700 p-2 rounded w-full" {...register("planType")}>
              <option value="">Seleccionar</option>
              <option value="General">General</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Gas">Gas</option>
              <option value="Agua">Agua</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">N° de Plano actualización</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("planNumberUpdate")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Año actualización</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("yearUpdate", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Formalidades</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("formalities")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Documentación</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("documentation")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Contactos</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("contacts")} />
          </div>
        </section>
      </fieldset>

      {/* Subida de archivo PDF */}
      <fieldset className="border border-blue-500 rounded p-4">
        <legend className="text-lg font-semibold text-blue-400 px-2">Archivo PDF del Plano (opcional)</legend>
        <div className="mt-4">
          <label className="block text-gray-300 mb-2">Seleccionar PDF</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="bg-gray-700 p-2 rounded w-full text-white"
          />
          {pdfFile && <p className="text-green-400 text-sm mt-1">✓ {pdfFile.name}</p>}
        </div>
      </fieldset>

      {status === 'success' && <p className="text-green-400 text-center font-semibold">✓ Plano guardado correctamente</p>}
      {status === 'error' && <p className="text-red-400 text-center">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Guardando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default PlanForm;
