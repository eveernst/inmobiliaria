'use client';

import { getProperty } from '@/api/propertyApi';
import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

interface Classification {
  id: number;
  name: string;
}

interface Installation {
  id: number;
  name: string;
  quantity: number;
  file: string | null;
  details: string;
  classification: Classification;
}

interface DocumentRecord {
  id: number;
  filePath?: string;
}

interface WritingRecord extends DocumentRecord {
  writingNumber?: number;
  domain?: string;
  actingNotary?: string;
}

interface PlanRecord extends DocumentRecord {
  planNumber?: string;
  planType?: string;
  profesional?: string;
}

interface InsuranceRecord extends DocumentRecord {
  name?: string;
  insuredProperty?: string;
  insuranceDate?: string;
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
  classification: Classification;
  installations: Installation[];
  writings: WritingRecord[];
  plans: PlanRecord[];
  insurances: InsuranceRecord[];
}

const FileLink = ({ filePath, label }: { filePath?: string; label: string }) => {
  if (!filePath) return <span className="text-gray-500 italic">Sin archivo</span>;
  const url = `${API_BASE}/${filePath}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
      📄 {label}
    </a>
  );
};

const PropertyView: React.FC = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get('id'));
    if (!id) return;
    getProperty(id)
      .then((data) => setProperty(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Cargando...</div>;
  if (!property) return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Propiedad no encontrada</div>;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-8 space-y-8">
        <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">Detalles de la Propiedad</h1>

        {/* Información General */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Información General</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>ID:</strong> {property.id}</p>
            <p><strong>Código de Buen Uso:</strong> {property.goodUseCode}</p>
            <p><strong>Provincia:</strong> {property.province}</p>
            <p><strong>Localidad:</strong> {property.locality}</p>
            <p><strong>Dirección:</strong> {property.address}</p>
            <p><strong>Código Postal:</strong> {property.postalCode}</p>
            <p><strong>Entre calles:</strong> {property.betweenStreets1} y {property.betweenStreets2}</p>
            <p><strong>Barrio:</strong> {property.district}</p>
            <p><strong>Destino:</strong> {property.destiny}</p>
            <p><strong>Estado:</strong> {property.state === 1 ? 'Alquilado' : 'Disponible'}</p>
            <p><strong>Activo:</strong> {property.active ? 'Sí' : 'No'}</p>
            <p><strong>CLFC:</strong> {property.clfc}</p>
            <p className="col-span-2"><strong>Mantenimiento:</strong> {property.detailsMaintenance}</p>
            <p className="col-span-2"><strong>Descripción:</strong> {property.description}</p>
          </div>
        </section>

        {/* Clasificación */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Clasificación</h2>
          {property.classification ? (
            <p>{property.classification.name} (ID: {property.classification.id})</p>
          ) : (
            <p className="text-gray-400">Sin clasificación</p>
          )}
        </section>

        {/* Instalaciones */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Instalaciones</h2>
          {property.installations?.length > 0 ? (
            <ul className="space-y-3">
              {property.installations.map((inst) => (
                <li key={inst.id} className="bg-gray-700 p-4 rounded-lg">
                  <p><strong>Nombre:</strong> {inst.name}</p>
                  <p><strong>Cantidad:</strong> {inst.quantity}</p>
                  <p><strong>Detalles:</strong> {inst.details}</p>
                  <p><strong>Clasificación:</strong> {inst.classification?.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sin instalaciones</p>
          )}
        </section>

        {/* Escrituras */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Escrituras</h2>
          {property.writings?.length > 0 ? (
            <ul className="space-y-3">
              {property.writings.map((w) => (
                <li key={w.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div className="text-sm">
                    {w.writingNumber && <p><strong>N° escritura:</strong> {w.writingNumber}</p>}
                    {w.domain && <p><strong>Dominio:</strong> {w.domain}</p>}
                    {w.actingNotary && <p><strong>Escribano:</strong> {w.actingNotary}</p>}
                  </div>
                  <FileLink filePath={w.filePath} label="Ver PDF" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sin escrituras</p>
          )}
          <a
            href={`/document-manager?propertyId=${property.id}&tab=writing`}
            className="inline-block mt-3 bg-slate-600 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition"
          >
            + Agregar escritura
          </a>
        </section>

        {/* Planos */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Planos</h2>
          {property.plans?.length > 0 ? (
            <ul className="space-y-3">
              {property.plans.map((p) => (
                <li key={p.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div className="text-sm">
                    {p.planNumber && <p><strong>N° plano:</strong> {p.planNumber}</p>}
                    {p.planType && <p><strong>Tipo:</strong> {p.planType}</p>}
                    {p.profesional && <p><strong>Profesional:</strong> {p.profesional}</p>}
                  </div>
                  <FileLink filePath={p.filePath} label="Ver PDF" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sin planos</p>
          )}
          <a
            href={`/document-manager?propertyId=${property.id}&tab=plan`}
            className="inline-block mt-3 bg-slate-600 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition"
          >
            + Agregar plano
          </a>
        </section>

        {/* Seguros */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Seguros</h2>
          {property.insurances?.length > 0 ? (
            <ul className="space-y-3">
              {property.insurances.map((ins) => (
                <li key={ins.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                  <div className="text-sm">
                    {ins.name && <p><strong>Responsable:</strong> {ins.name}</p>}
                    {ins.insuredProperty && <p><strong>Bien asegurado:</strong> {ins.insuredProperty}</p>}
                    {ins.insuranceDate && <p><strong>Fecha:</strong> {ins.insuranceDate}</p>}
                  </div>
                  <FileLink filePath={ins.filePath} label="Ver PDF" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sin seguros</p>
          )}
          <a
            href={`/document-manager?propertyId=${property.id}&tab=insurance`}
            className="inline-block mt-3 bg-slate-600 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition"
          >
            + Agregar seguro
          </a>
        </section>

      </div>
    </div>
  );
};

export default PropertyView;
