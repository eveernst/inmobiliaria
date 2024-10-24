"use client";

import React, { useState } from 'react';
import Header from "../../../components/header";

export default function Installation() {
  const [installationData, setInstallationData] = useState({
    name: "Instalación A",
    classification: "Opción 1",
    quantity: "5",
    details: "Detalles de la instalación A"
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = () => {
    setEditingField(null);
  };

  const handleChange = (field: string, value: string) => {
    setInstallationData(prev => ({ ...prev, [field]: value }));
  };

  const incrementQuantity = () => {
    const currentValue = parseInt(installationData.quantity) || 0;
    handleChange('quantity', (currentValue + 1).toString());
  };

  const decrementQuantity = () => {
    const currentValue = parseInt(installationData.quantity) || 0;
    if (currentValue > 0) {
      handleChange('quantity', (currentValue - 1).toString());
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      <div className="mt-7">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Modificar Información de Instalación</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg">Nombre: {editingField === 'name' ? (
                <input
                  type="text"
                  value={installationData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white px-2 py-1 rounded-md"
                />
              ) : installationData.name}</p>
              <button onClick={() => editingField === 'name' ? handleSave() : handleEdit('name')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                ✏️
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg">Clasificación: {editingField === 'classification' ? (
                <select
                  value={installationData.classification}
                  onChange={(e) => handleChange('classification', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white px-2 py-1 rounded-md"
                >
                  <option value="Opción 1">Opción 1</option>
                  <option value="Opción 2">Opción 2</option>
                  <option value="Opción 3">Opción 3</option>
                </select>
              ) : installationData.classification}</p>
              <button onClick={() => editingField === 'classification' ? handleSave() : handleEdit('classification')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                ✏️
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg">Cantidad: {editingField === 'quantity' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={installationData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white px-2 py-1 rounded-md w-20"
                  />
                  <div className="flex flex-col">
                    <button
                      onClick={incrementQuantity}
                      className="p-1 h-6 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={decrementQuantity}
                      className="p-1 h-6 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              ) : installationData.quantity}</p>
              <button onClick={() => editingField === 'quantity' ? handleSave() : handleEdit('quantity')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                ✏️
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg">Archivo: <span className="text-gray-400">No file uploaded</span></p>
              <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                ✏️
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-orange-500">Detalles instalación</h2>
                <button onClick={() => editingField === 'details' ? handleSave() : handleEdit('details')} className="p-2 bg-gray-600 hover:bg-gray-500 rounded-md">
                  ✏️
                </button>
              </div>
              {editingField === 'details' ? (
                <textarea
                  value={installationData.details}
                  onChange={(e) => handleChange('details', e.target.value)}
                  className="w-full bg-gray-600 border-gray-500 text-white resize-none px-4 py-2 rounded-md"
                  rows={4}
                />
              ) : (
                <p className="text-white">{installationData.details}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-16">
        <button
          className="bg-gray-700 text-orange-400 hover:bg-gray-600 border-gray-600 border px-6 py-3 rounded-md text-lg"
        >
          Cancelar
        </button>
        <button
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-md text-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </main>
  );
}
