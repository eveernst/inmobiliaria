'use client';
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { saveInsurance, uploadInsuranceFile } from "@/api/insuranceApi";

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
  content: boolean;
  values: boolean;
  insuranceDate: string;
  AnualFormDate: string;
  observations: string;
}

const InsuranceForm = ({ propertyId }: InsuranceFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await saveInsurance(propertyId, data);
      if (pdfFile) {
        await uploadInsuranceFile(propertyId, pdfFile);
      }
      setStatus('success');
      reset();
      setPdfFile(null);
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.response?.data?.message || 'Error al guardar el seguro');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gray-800 rounded shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Formulario de Seguro Inmueble</h1>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Responsable del Seguro</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Nombre completo</label>
            <input type="text" className="bg-gray-700 p-2 rounded w-full" {...register("name", { required: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Teléfono</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("phone", { required: true, valueAsNumber: true })} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Contacto</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">E-mail</label>
            <input type="email" className="bg-gray-700 p-2 rounded w-full" {...register("email", { required: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Bien asegurado</label>
            <select className="bg-gray-700 p-2 rounded w-full" {...register("insuredProperty", { required: true })}>
              <option value="">Seleccionar</option>
              <option value="Templo">Templo</option>
              <option value="Terreno">Terreno</option>
              <option value="Antena">Antena</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Instituciones Educativas">Instituciones Educativas</option>
              <option value="Predios">Predios</option>
              <option value="Salon">Salón</option>
              <option value="Tinglado">Tinglado</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Tipo de seguro</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" {...register("insuranceARM")} /> Aseguradora ARM
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" {...register("insuranceASE")} /> Aseguradora ART
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" {...register("team")} /> Equipo
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" {...register("content")} /> Contenido
          </label>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" {...register("values")} /> Valores
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Fechas</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Fecha del seguro</label>
            <input type="date" className="bg-gray-700 p-2 rounded w-full" {...register("insuranceDate")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Fecha formulario anual</label>
            <input type="date" className="bg-gray-700 p-2 rounded w-full" {...register("AnualFormDate")} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Observaciones</legend>
        <textarea className="bg-gray-700 p-2 rounded w-full mt-2" rows={4} {...register("observations")} />
      </fieldset>

      {/* Subida de archivo PDF */}
      <fieldset className="border border-blue-500 rounded p-4">
        <legend className="text-lg font-semibold text-blue-400 px-2">Archivo PDF del Seguro (opcional)</legend>
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

      {status === 'success' && <p className="text-green-400 text-center font-semibold">✓ Seguro guardado correctamente</p>}
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

export default InsuranceForm;
