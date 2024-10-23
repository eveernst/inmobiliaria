"use client";

import React from 'react';
import Header from "../../../components/header";

export default function Installation() {
  const installationData = {
    name: "Instalación A",
    classification: "Opción 1",
    quantity: "5",
    details: "Detalles de la instalación A"
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      <div className="mt-7">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Visualizar Información de Instalación</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-orange-500 mb-2">Detalles Generales</h2>
              <p className="text-lg"><span className="font-semibold">Nombre:</span> {installationData.name}</p>
              <p className="text-lg"><span className="font-semibold">Clasificación:</span> {installationData.classification}</p>
              <p className="text-lg"><span className="font-semibold">Cantidad:</span> {installationData.quantity}</p>
              <p className="text-lg"><span className="font-semibold">Archivo:</span> <span className="text-gray-400">No file uploaded</span></p>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-orange-500 mb-2">Detalles instalación</h2>
              <p className="text-white">{installationData.details}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <button
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-md text-lg"
        >
          Volver
        </button>
      </div>
    </main>
  );
}