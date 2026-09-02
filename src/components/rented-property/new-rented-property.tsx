"use client";

import React, { useState } from 'react';
import { User, ChevronDown, Upload } from 'lucide-react';
import ImageViewModal from '@/components/ui/ImageViewModal';

export default function NewRentedProperty() {
  const [contractImage, setContractImage] = useState<File | null>(null);
  const [contractImagePreview, setContractImagePreview] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setContractImage(file);

    if (!file) {
      setContractImagePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setContractImagePreview((reader.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setContractImage(null);
    setContractImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xl font-bold text-orange-500">AAC</span>
        </div>
        <div className="flex items-center">
          <select className="bg-gray-800 text-gray-300 border-none">
            <option>Inmueble alquilado</option>
          </select>
          <span className="ml-4 mr-2">Usuario</span>
          <User className="text-orange-500" />
        </div>
      </header>

      <main className="container mx-auto mt-8 p-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Nueva Documentacion Inmueble Alquilado</h1>

        {/* Distribución en 2 columnas */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Datos del propietario</label>
              <input type="text" className="w-full bg-gray-800 rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">Contacto</label>
              <input type="text" className="w-full bg-gray-800 rounded p-2" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Afectacion</label>
              <div className="relative">
                <select className="w-full bg-gray-800 rounded p-2 appearance-none">
                  <option>Seleccionar</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Nueva fila: Datos del inquilino y Dirección */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-1">Datos del inquilino</label>
            <input type="text" className="w-full bg-gray-800 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input type="text" className="w-full bg-gray-800 rounded p-2" />
          </div>
        </div>

        {/* Nueva fila: Contacto y Localidad */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-1">Contacto</label>
            <input type="text" className="w-full bg-gray-800 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Localidad</label>
            <input type="text" className="w-full bg-gray-800 rounded p-2" />
          </div>
        </div>

        {/* Nueva fila: Provincia y Tipo de ajuste */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-1">Provincia</label>
            <div className="relative">
              <select className="w-full bg-gray-800 rounded p-2 appearance-none">
                <option>Seleccionar</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
            </div>
          </div>
          <div>
            <label className="block mb-1">Tipo de ajuste</label>
            <div className="relative">
              <select className="w-full bg-gray-800 rounded p-2 appearance-none">
                <option>Seleccionar</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Nueva fila: Fechas y Monto */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-1">Fecha de comienzo del contrato</label>
            <input type="date" className="w-full bg-gray-800 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Fecha de finalización del contrato</label>
            <input type="date" className="w-full bg-gray-800 rounded p-2" />
          </div>
          <div>
            <label className="block mb-1">Monto $</label>
            <input type="number" className="w-full bg-gray-800 rounded p-2" />
          </div>
        </div>

        <div className="mt-8">
          <label className="block mb-1">Contrato</label>
          <div className="flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="contractImage"
            />
            <label htmlFor="contractImage" className="w-full bg-gray-800 rounded p-2 flex items-center justify-between cursor-pointer">
              <span>{contractImage ? contractImage.name : 'Subir imagen'}</span>
              <Upload className="text-orange-500" />
            </label>
          </div>
          {contractImagePreview && (
            <div className="mt-3 flex items-center gap-2">
              <img src={contractImagePreview} alt="Contrato" className="w-32 h-auto rounded" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                title="Eliminar imagen"
              >
                <span aria-hidden="true">X</span>
              </button>
              <ImageViewModal imageUrl={contractImagePreview} imageName="Contrato" />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button className="px-6 py-2 bg-orange-500 text-gray-900 rounded hover:bg-orange-600">
            Cancelar
          </button>
          <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-600">
            Aceptar
          </button>
        </div>
      </main>
    </div>
  );
}
