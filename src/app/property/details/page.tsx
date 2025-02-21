'use client';

import { getProperty } from '@/api/propertyApi';
import React, { useEffect, useState } from 'react';

interface Installation {
  id: number;
  name: string;
  quantity: number;
  file: string | null;
  details: string;
  classification: {
    name: string;
    id: number;
  };
}

interface Property {
  id: number;
  goodUseCode: number;
  file: string | null;
  province: string;
  locality: string;
  address: string;
  postalCode: number;
  betweenStreets1: string;
  betweenStreets2: string;
  district: string;
  destiny: string;
  state: number;
  active: boolean;
  clfc: string;
  detailsMaintenance: string;
  description: string;
  classification: {
    name: string;
    id: number;
  };
  installations: Installation[];

}

const PropertyView: React.FC = () => {
  const [property, setProperty] = useState<Property>({
    id: 0,
    goodUseCode: 0,
    file: null,
    province: '',
    locality: '',
    address: '',
    postalCode: 0,
    betweenStreets1: '',
    betweenStreets2: '',
    district: '',
    destiny: '',
    state: 0,
    active: false,
    clfc: '',
    detailsMaintenance: '',
    description: '',
    classification: {
      name: '',
      id: 0,
    },
    installations: [],
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get('id'));
    async function fetchProperty(id: number) {
      getProperty(id).then((data) => {
        setProperty(data);
      });
    }
    fetchProperty(id);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Detalles de la Propiedad</h1>

        {/* Datos Generales */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Información General</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {property.id}</p>
            <p><strong>Código de Buen Uso:</strong> {property.goodUseCode}</p>
            <p><strong>Provincia:</strong> {property.province}</p>
            <p><strong>Localidad:</strong> {property.locality}</p>
            <p><strong>Dirección:</strong> {property.address}</p>
            <p><strong>Código Postal:</strong> {property.postalCode}</p>
            <p><strong>Entre calles:</strong> {property.betweenStreets1} y {property.betweenStreets2}</p>
            <p><strong>Barrio:</strong> {property.district}</p>
            <p><strong>Destino:</strong> {property.destiny}</p>
            <p><strong>Estado:</strong> {property.state ? 'Activo' : 'Inactivo'}</p>
            <p><strong>Mantenimiento:</strong> {property.detailsMaintenance}</p>
            <p><strong>Descripción:</strong> {property.description}</p>
          </div>
        </section>

        {/* Clasificación */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Clasificación</h2>
          {property.classification ? (
            <div>
              <p><strong>Nombre:</strong> {property.classification.name}</p>
              <p><strong>ID:</strong> {property.classification.id}</p>
            </div>
          ) : (
            <p>No hay clasificación registrada.</p>
          )}
        </section>

        {/* Instalaciones */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Instalaciones</h2>
          {property.installations.length > 0 ? (
            <ul className="space-y-4">
              {property.installations.map((installation) => (
                <li
                  key={installation.id}
                  className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                >
                  <p><strong>Nombre:</strong> {installation.name}</p>
                  <p><strong>Cantidad:</strong> {installation.quantity}</p>
                  <p><strong>Detalles:</strong> {installation.details}</p>
                  <p>
                    <strong>Clasificación:</strong> {installation.classification.name} (ID: {installation.classification.id})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay instalaciones registradas.</p>
          )}
        </section>

        {/* Documentacion */}
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Documentación</h2>
            <a
                  href={`/property/documentation?id=${property.id}`}
                  className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                >
                  <span className="material-icons-outlined mr-2">Ver Documentacion</span>
                </a>
        </section>
      </div>
    </div>
  );
};

export default PropertyView;
