"use client";

import React, { useState } from 'react';
import Header from "../../../components/header";

export default function NewDocumentation() {
  const [documentType, setDocumentType] = useState<string>('Plano de casa');

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-4xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Nueva Documentación</h1>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-48 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="Plano de casa">Plano de casa</option>
            <option value="Otro tipo">Otro tipo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <input type="checkbox" id="planoGeneral" className="mr-2" />
            <label htmlFor="planoGeneral">Plano General</label>
          </div>
          <div></div>
          <input placeholder="N° de Plano" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Año" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Contacto del profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Visado Municipal" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Fecha" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['Plano estructura', 'Plano gas', 'Plano agua', 'Plano Luz', 'Anteproyecto', 'Final de Obra'].map((item) => (
            <div key={item} className="flex items-center">
              <input type="checkbox" id={item} className="mr-2" />
              <label htmlFor={item}>{item}</label>
              <button className="ml-auto bg-gray-700 text-white px-4 py-1 rounded-md">
                Imagen
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">ACTUALIZACIÓN</h2>
          <div className="grid grid-cols-3 gap-4">
            <select className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md">
              <option value="tipo1">Tipo 1</option>
              <option value="tipo2">Tipo 2</option>
            </select>
            <input placeholder="N° de Plano" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Año" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Contacto del profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md col-span-2" />
            <input placeholder="Visado Municipal" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Fecha" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="N°" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
              ESTADO
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
              Ver imagen
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-2 rounded-md">
            Cancelar
          </button>
          <button className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-2 rounded-md">
            Aceptar
          </button>
        </div>
      </div>
    </main>
  );
}
