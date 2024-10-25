"use client";

import React, { useState } from 'react';
import { User, ChevronDown, Upload, Edit2, Check } from 'lucide-react';

export default function ModifyRentedProperty() {
  const [contractImage, setContractImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
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
  });

  const [editing, setEditing] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setContractImage(file);
  };

  const handleEdit = (field: string) => {
    setEditing(field);
  };

  const handleSave = (field: string) => {
    setEditing(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (field: string, label: string, type: string = 'text') => (
    <div>
      <label className="block mb-1">{label}</label>
      {editing === field ? (
        <div className="flex">
          <input
            type={type}
            value={formData[field as keyof typeof formData]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-gray-800 rounded-l p-2"
          />
          <button
            onClick={() => handleSave(field)}
            className="bg-green-500 text-white p-2 rounded-r"
          >
            <Check size={20} />
          </button>
        </div>
      ) : (
        <div className="flex">
          <input
            type={type}
            value={formData[field as keyof typeof formData]}
            readOnly
            className="w-full bg-gray-800 rounded-l p-2"
          />
          <button
            onClick={() => handleEdit(field)}
            className="bg-orange-500 text-white p-2 rounded-r"
          >
            <Edit2 size={20} />
          </button>
        </div>
      )}
    </div>
  );

  const renderEditableSelect = (field: string, label: string, options: string[]) => (
    <div>
      <label className="block mb-1">{label}</label>
      {editing === field ? (
        <div className="flex">
          <select
            value={formData[field as keyof typeof formData]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full bg-gray-800 rounded-l p-2"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button
            onClick={() => handleSave(field)}
            className="bg-green-500 text-white p-2 rounded-r"
          >
            <Check size={20} />
          </button>
        </div>
      ) : (
        <div className="flex">
          <input
            type="text"
            value={formData[field as keyof typeof formData]}
            readOnly
            className="w-full bg-gray-800 rounded-l p-2"
          />
          <button
            onClick={() => handleEdit(field)}
            className="bg-orange-500 text-white p-2 rounded-r"
          >
            <Edit2 size={20} />
          </button>
        </div>
      )}
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
        <h1 className="text-3xl font-bold text-orange-500 mb-6">Modificar Documentacion Inmueble Alquilado</h1>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderEditableField('ownerData', 'Datos del propietario')}
            {renderEditableField('ownerContact', 'Contacto')}
          </div>

          <div className="space-y-4">
            {renderEditableSelect('affectation', 'Afectacion', ['Seleccionar', 'Opción 1', 'Opción 2'])}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderEditableField('tenantData', 'Datos del inquilino')}
          {renderEditableField('address', 'Dirección')}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderEditableField('tenantContact', 'Contacto')}
          {renderEditableField('locality', 'Localidad')}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderEditableSelect('province', 'Provincia', ['Seleccionar', 'Buenos Aires', 'Córdoba', 'Santa Fe'])}
          {renderEditableSelect('adjustmentType', 'Tipo de ajuste', ['Seleccionar', 'Mensual', 'Trimestral', 'Semestral'])}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderEditableField('startDate', 'Fecha de comienzo del contrato', 'date')}
          {renderEditableField('endDate', 'Fecha de finalización del contrato', 'date')}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {renderEditableField('amount', 'Monto $', 'number')}
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