"use client";

import React, { useState, ChangeEvent } from 'react';
import Header from "../../../components/header";

export default function NuevaDocumentacion() {
  const [tipoDocumento, setTipoDocumento] = useState<string>('Escritura');
  const [imagenJDAAC, setImagenJDAAC] = useState<File | null>(null);
  const [imagenJDUA, setImagenJDUA] = useState<File | null>(null);
  const [fotoInterior1, setFotoInterior1] = useState<File | null>(null);
  const [fotoInterior2, setFotoInterior2] = useState<File | null>(null);
  const [tipoDetalle, setTipoDetalle] = useState<string>('DetalleEspacios');
  const [detalleEspacios, setDetalleEspacios] = useState<string>('');
  const [documentacion, setDocumentacion] = useState<string>('');
  const [detalleEspaciosAdicional, setDetalleEspaciosAdicional] = useState<string>('');
  const [informeCatastral, setInformeCatastral] = useState<string>('Link');

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Nueva Documentacion Escritura</h1>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="Escritura">Escritura</option>
            {/* Agrega más opciones si es necesario */}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <InputField label="N° de escritura" />
            <InputField label="N° de Voto de JD AAC" />
            <FileInput 
              label="Imagen de Voto de JD AAC"
              onChange={handleFileChange(setImagenJDAAC)}
            />
            <InputField label="N° de Voto de JD UA" />
            <FileInput 
              label="Imagen de Voto de JD UA"
              onChange={handleFileChange(setImagenJDUA)}
            />
          </div>
          <div>
            <InputField label="Fecha de JD AAC" />
            <InputField label="Fecha de JD UA" />
            <InputField label="Nomenclatura catastral" />
            <InputField label="Escribano Actuante" />
            <InputField label="Contacto del escribano" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <InputField label="Dominio" />
          <InputField label="Folio" />
          <InputField label="Tomo" />
          <InputField label="Año" />
          <InputField label="Departamento" />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <InputField label="Superficie Total" />
          <InputField label="Superficie cubierta" />
          <InputField label="Sup. con mejoras" />
          <InputField label="$" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md w-full mb-4">
              Ubicación en mapa
            </button>
          </div>
          <div>
            <label className="block mb-2">Informe catastral</label>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${informeCatastral === 'Link' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setInformeCatastral('Link')}
              >
                Link
              </button>
              <button
                className={`px-4 py-2 rounded-md ${informeCatastral === 'PDF' ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setInformeCatastral('PDF')}
              >
                PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <FileInput 
            label="Foto interior 1"
            onChange={handleFileChange(setFotoInterior1)}
          />
          <FileInput 
            label="Foto interior 2"
            onChange={handleFileChange(setFotoInterior2)}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-start space-x-4 mb-4">
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
              label="Detalle Espacios"
              isActive={tipoDetalle === 'DetalleEspaciosAdicional'}
              onClick={() => setTipoDetalle('DetalleEspaciosAdicional')}
            />
          </div>
          <textarea 
            className="w-full h-32 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
            placeholder="Ingrese detalles..."
            value={
              tipoDetalle === 'DetalleEspacios' ? detalleEspacios :
              tipoDetalle === 'Documentacion' ? documentacion :
              detalleEspaciosAdicional
            }
            onChange={(e) => {
              if (tipoDetalle === 'DetalleEspacios') setDetalleEspacios(e.target.value);
              else if (tipoDetalle === 'Documentacion') setDocumentacion(e.target.value);
              else setDetalleEspaciosAdicional(e.target.value);
            }}
          />
        </div>

        <div className="flex justify-center space-x-4">
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
      <button 
        className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
        onClick={() => document.getElementById(label)?.click()}
      >
        imagen
      </button>
      <input
        id={label}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
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