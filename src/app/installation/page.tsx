"use client";

import React, { useState } from 'react';
import Header from "../../components/header";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Installation() {
  const [quantity, setQuantity] = useState<string>('');
  const [classification, setClassification] = useState<string>('');

  const incrementQuantity = () => {
    const currentValue = parseInt(quantity) || 0;
    setQuantity((currentValue + 1).toString());
  };

  const decrementQuantity = () => {
    const currentValue = parseInt(quantity) || 0;
    if (currentValue > 0) {
      setQuantity((currentValue - 1).toString());
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      <div className="mt-7"> {/* Added margin-top to move the content down */}
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Alta Instalación</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Nombre instalación"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 px-4 py-2 rounded-md w-full"
            />
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white px-4 py-2 rounded-md w-full"
            >
              <option value="" disabled>Clasificación</option>
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
              <option value="option3">Opción 3</option>
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Cantidad"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 px-4 py-2 rounded-md w-full"
              />
              <div className="flex flex-col">
                <button
                  onClick={incrementQuantity}
                  className="p-1 h-6 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                >
                  <ChevronUp className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={decrementQuantity}
                  className="p-1 h-6 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
                >
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <input
              type="file"
              className="bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded-md w-full"
            />
          </div>

          <div className="flex-1">
            <div className="bg-gray-700 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2 text-orange-500">Detalles instalación</h2>
              <textarea
                placeholder="Ingrese detalles de la instalación aquí"
                className="w-full bg-gray-700 border-gray-600 text-white resize-none placeholder-gray-400 px-4 py-2 rounded-md"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-16"> {/* Center and add gap between buttons */}
        <button
          className="bg-gray-700 text-orange-400 hover:bg-gray-600 border-gray-600 border px-6 py-3 rounded-md text-lg"
        >
          Cancelar
        </button>
        <button
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-md text-lg"
        >
          Aceptar
        </button>
      </div>
    </main>
  );
}
