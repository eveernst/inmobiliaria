"use client";

import React from 'react';
import { User, ChevronDown, Upload } from 'lucide-react';

export default function DocumentationForm() {
  const formData = {
    ownerData: 'Datos del propietario',
    ownerContact: 'Contacto del propietario',
    affectation: 'Afectación',
    tenantData: 'Datos del inquilino',
    address: 'Dirección',
    tenantContact: 'Contacto del inquilino',
    locality: 'Localidad',
    province: 'Provincia',
    adjustmentType: 'Tipo de ajuste',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    amount: '1000'
  };

  const renderField = (label: string, value: string) => (
    <div>
      <label className="block mb-1 text-gray-400">{label}</label>
      <div className="w-full bg-gray-800 rounded p-2 text-gray-300">{value}</div>
    </div>
  );

  const renderSelect = (label: string, value: string) => (
    <div>
      <label className="block mb-1 text-gray-400">{label}</label>
      <div className="relative">
        <div className="w-full bg-gray-800 rounded p-2 text-gray-300">{value}</div>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Visualizar Documentacion Inmueble Alquilado</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderField('Datos del propietario', formData.ownerData)}
            {renderField('Contacto', formData.ownerContact)}
          </div>

          <div className="space-y-4">
            {renderSelect('Afectacion', formData.affectation)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderField('Datos del inquilino', formData.tenantData)}
          {renderField('Dirección', formData.address)}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderField('Contacto', formData.tenantContact)}
          {renderField('Localidad', formData.locality)}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderSelect('Provincia', formData.province)}
          {renderSelect('Tipo de ajuste', formData.adjustmentType)}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderField('Fecha de comienzo del contrato', formData.startDate)}
          {renderField('Fecha de finalización del contrato', formData.endDate)}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderField('Monto $', formData.amount)}
        </div>

        <div className="mt-8">
          <label className="block mb-1 text-gray-400">Contrato</label>
          <div className="flex items-center">
            <div className="w-full bg-gray-800 rounded p-2 flex items-center justify-between">
              <span>No hay imagen cargada</span>
              <Upload className="text-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button className="px-6 py-2 bg-orange-500 text-gray-900 rounded hover:bg-orange-600">
            Volver
          </button>
        </div>
      </main>
    </div>
  );
}