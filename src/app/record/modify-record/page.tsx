"use client";

import React, { useState } from 'react';
import Header from "../../../components/header";
import NewPlan from '@/components/plan/new-plan';
import NewRentedProperty from '@/components/rented-property/new-rented-property';
import NewWriting from '@/components/writing/new_writing';

export default function DocumentationModifier() {
  const [documentType, setDocumentType] = useState<string>('');
  const renderDocumentContent = () => {
    switch (documentType) {
      case 'escritura':
        return <NewWriting />;
      case 'seguro':
        return <SeguroComponent />;
      case 'inmueble':
        return <NewRentedProperty />;
      case 'plano':
        return <NewPlan />;
      default:
        return <p className="text-gray-400">Por favor, selecciona un tipo de documento.</p>;
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">Modificar Documentación</h1>
        
        <div className="w-full max-w-md mb-8">
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="" disabled>Seleccionar tipo de documento</option>
            <option value="escritura">Escritura</option>
            <option value="seguro">Seguro inmueble</option>
            <option value="inmueble">Inmueble alquilado</option>
            <option value="plano">Plano de casa</option>
            <option value="servicios">Servicios</option>
            <option value="impuestosP">Impuestos provinciales</option>
            <option value="impuestosM">Impuestos municipales</option>
          </select>
        </div>

        <div className="flex justify-center space-x-8 mt-12">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-12 py-3 rounded-md">
            Cancelar
          </button>
          <button className="bg-gray-600 text-white hover:bg-gray-700 px-12 py-3 rounded-md">
            Aceptar
          </button>
        </div>
      </div>
    </main>
  );
}
