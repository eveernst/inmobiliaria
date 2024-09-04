"use client";

import React, { useState, ChangeEvent } from 'react';
import Header from "../../../components/header";

export default function NuevaEscritura() {
  const [tipoDocumento, setTipoDocumento] = useState<string>('Escritura');
  const [imagenJDAAC, setImagenJDAAC] = useState<File | null>(null);
  const [imagenJDUA, setImagenJDUA] = useState<File | null>(null);
  const [fotoInterior1, setFotoInterior1] = useState<File | null>(null);
  const [fotoInterior2, setFotoInterior2] = useState<File | null>(null);
  const [tipoDetalle, setTipoDetalle] = useState<string>('DetalleEspacios');
  const [detalleEspacios, setDetalleEspacios] = useState<string>('');
  const [documentacion, setDocumentacion] = useState<string>('');
  const [detalleEspaciosAdicional, setDetalleEspaciosAdicional] = useState<string>('');

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Nueva Escritura</h1>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="Escritura">Escritura</option>
            {/* Agrega más opciones si es necesario */}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <InputField label="N° de escritura" />
            <InputField label="N° de Voto de JD AAC" />
            <FileInput 
              label="Imagen de Voto de JD AAC"
              onChange={handleFileChange(setImagenJDAAC)}
            />
          </div>
          <div>
            <InputField label="Fecha de JD AAC" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <InputField label="N° de Voto de JD UA" />
            <FileInput 
              label="Imagen de Voto de JD UA"
              onChange={handleFileChange(setImagenJDUA)}
            />
          </div>
          <div>
            <InputField label="Fecha de JD UA" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mt-4">
          <InputField label="Dominio" />
          <InputField label="Folio" />
          <InputField label="Tomo" />
          <InputField label="Año" />
          <InputField label="Departamento" />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <InputField label="Superficie Total" />
          <InputField label="Superficie cubierta" />
          <InputField label="Sup. con mejoras" />
          <InputField label="$" />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <InputField label="Nomenclatura catastral" />
            <InputField label="Escribano Actuante" />
          </div>
          <div>
            <div className="mb-4">
              <label className="block mb-2">Ubicación en mapa</label>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-md w-full">Link o PDF</button>
            </div>
            <InputField label="Contacto del escribano" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FileInput 
            label="Foto interior 1"
            onChange={handleFileChange(setFotoInterior1)}
          />
          <FileInput 
            label="Foto interior 2"
            onChange={handleFileChange(setFotoInterior2)}
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-center space-x-4 mb-4">
            <TabButton 
              label="Detalle Espacios"
              isActive={tipoDetalle === 'DetalleEspacios'}
              onClick={() => setTipoDetalle('DetalleEspacios')}
            />
            <TabButton 
              label="Documentación"
              isActive={tipoDetalle === 'Documentacion'}
              onClick={() => setTipoDetalle('Documentacion')}
            />
            <TabButton 
              label="Detalle Espacios Adicional"
              isActive={tipoDetalle === 'DetalleEspaciosAdicional'}
              onClick={() => setTipoDetalle('DetalleEspaciosAdicional')}
            />
          </div>
          {tipoDetalle === 'DetalleEspacios' && (
            <textarea 
              className="w-full h-32 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
              placeholder="Ingrese detalles de espacios..."
              value={detalleEspacios}
              onChange={(e) => setDetalleEspacios(e.target.value)}
            />
          )}
          {tipoDetalle === 'Documentacion' && (
            <textarea 
              className="w-full h-32 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
              placeholder="Ingrese documentación adicional..."
              value={documentacion}
              onChange={(e) => setDocumentacion(e.target.value)}
            />
          )}
          {tipoDetalle === 'DetalleEspaciosAdicional' && (
            <textarea 
              className="w-full h-32 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
              placeholder="Ingrese detalles de espacios adicionales..."
              value={detalleEspaciosAdicional}
              onChange={(e) => setDetalleEspaciosAdicional(e.target.value)}
            />
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-12 py-3 rounded-md">
            Cancelar
          </button>
          <button className="bg-blue-600 text-white hover:bg-blue-700 px-12 py-3 rounded-md">
            Aceptar
          </button>
        </div>
      </div>
    </main>
  );
}

function InputField({ label }: { label: string }) {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <input type="text" className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
    </div>
  );
}

function FileInput({ label, onChange }: { label: string, onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-700 file:text-white
          hover:file:bg-gray-600"
      />
    </div>
  );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      className={`px-4 py-2 rounded-md ${isActive ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}