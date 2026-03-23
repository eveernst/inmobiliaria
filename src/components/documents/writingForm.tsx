'use client';
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { saveWriting, uploadWritingFile } from "@/api/writingApi";

interface WritingFormProps {
  propertyId: number;
}

interface FormData {
  writingNumber: number;
  voteNumberJDAAC: number;
  voteDateJDAAC: string;
  voteNumberJDUA: number;
  voteDateJDUA: string;
  domain: string;
  folio: string;
  tomo: string;
  year: number;
  department: string;
  totalSurface: number;
  coveredSurface: number;
  improvementSurface: number;
  improvementValue: number;
  cadastralNomenclature: string;
  ubicationMap: string;
  cadastralInform: string;
  actingNotary: string;
  notaryContact: number;
  formalities: string;
  documentation: string;
  detailSpaces: string;
}

const WritingForm = ({ propertyId }: WritingFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      // 1. Guardar datos del formulario
      await saveWriting(propertyId, data);

      // 2. Si hay archivo PDF, subirlo
      if (pdfFile) {
        await uploadWritingFile(propertyId, pdfFile);
      }

      setStatus('success');
      reset();
      setPdfFile(null);
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.response?.data?.message || 'Error al guardar la escritura');
    }
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
            <label className="block text-gray-300 mb-1">Número de escritura</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("writingNumber", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Voto JD AAC</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("voteNumberJDAAC", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Fecha de JD AAC</label>
            <input type="date" className="bg-gray-700 p-2 rounded w-full" {...register("voteDateJDAAC")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Voto JD UA</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("voteNumberJDUA", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Fecha de JD UA</label>
            <input type="date" className="bg-gray-700 p-2 rounded w-full" {...register("voteDateJDUA")} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Detalles Técnicos</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Dominio</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("domain")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Folio</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("folio")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Tomo</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("tomo")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Año</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("year", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Departamento</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("department")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Superficie Total</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("totalSurface", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Superficie Cubierta</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("coveredSurface", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Superficie con mejoras</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("improvementSurface", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Mejoras ($)</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("improvementValue", { valueAsNumber: true })} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border border-gray-600 rounded p-4">
        <legend className="text-lg font-semibold text-white px-2">Datos Adicionales</legend>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Nomenclatura catastral</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("cadastralNomenclature")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Ubicación en mapa</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("ubicationMap")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Informe catastral</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("cadastralInform")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Escribano Actuante</label>
            <input className="bg-gray-700 p-2 rounded w-full" {...register("actingNotary")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Contacto del Escribano</label>
            <input type="number" className="bg-gray-700 p-2 rounded w-full" {...register("notaryContact", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-1">Trámites</label>
            <textarea className="bg-gray-700 p-2 rounded w-full" rows={4} {...register("formalities")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Documentación</label>
            <textarea className="bg-gray-700 p-2 rounded w-full" rows={4} {...register("documentation")} />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Detalles Espacios</label>
            <textarea className="bg-gray-700 p-2 rounded w-full" rows={4} {...register("detailSpaces")} />
          </div>
        </div>
      </fieldset>

      {/* Subida de archivo PDF */}
      <fieldset className="border border-blue-500 rounded p-4">
        <legend className="text-lg font-semibold text-blue-400 px-2">Archivo PDF de Escritura (opcional)</legend>
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

      {status === 'success' && (
        <p className="text-green-400 text-center font-semibold">✓ Escritura guardada correctamente</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-center">{errorMsg}</p>
      )}

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

export default WritingForm;
