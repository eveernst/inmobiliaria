'use client';

import { getProperty } from '@/api/propertyApi';
import axiosInstance from '@/api/api';
import { resolveImageUrl } from '@/lib/imageUpload';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

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

interface DocBase {
  id: number;
}
interface Insurance extends DocBase { name?: string; insuredProperty?: string; }
interface Plan    extends DocBase { planNumber?: string; planType?: string; }
interface Rented  extends DocBase { ownerDetails?: string; contratStartDate?: string; }
interface Writing extends DocBase { writingNumber?: string; domain?: string; }

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
  destiny: string | number;
  state: number;
  active: boolean;
  clfc: string;
  detailsMaintenance: string;
  description: string;
  classification: Classification;
  installations: Installation[];
  insurances: Insurance[];
  plans: Plan[];
  renteds: Rented[];
  writings: Writing[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DESTINY_LABELS: Record<string, string> = {
  '0': 'Templo', '1': 'Terreno', '2': 'Antena', '3': 'Casa',
  '4': 'Departamento', '5': 'Institución Educativa', '6': 'Predio', '7': 'Otro',
};
const STATE_LABELS: Record<number, string> = { 0: 'Disponible', 1: 'Alquilado' };
const CLFC_LABELS: Record<string, string> = {
  '0': 'Sí', '1': 'Solicitar', '2': 'Solicitado', '3': 'No',
};

const docTypeLabel = (ins: Insurance | Plan | Rented | Writing, type: string) => {
  if (type === 'insurance') return (ins as Insurance).insuredProperty || `Seguro #${ins.id}`;
  if (type === 'plan')      return (ins as Plan).planType || `Plano #${ins.id}`;
  if (type === 'rented')    return (ins as Rented).ownerDetails || `Alquiler #${ins.id}`;
  if (type === 'writing')   return (ins as Writing).domain || `Escritura #${ins.id}`;
  return `Doc #${ins.id}`;
};

// ─── Modal de confirmación ────────────────────────────────────────────────────

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <p className="mb-6 text-center text-slate-200">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// ─── Componente principal ─────────────────────────────────────────────────────

const PropertyView: React.FC = () => {
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Estado para modal de confirmación de eliminación
  const [confirm, setConfirm] = useState<{
    show: boolean;
    message: string;
    onConfirm: () => void;
  }>({ show: false, message: '', onConfirm: () => {} });

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get('id'));

    // Detectar rol
    try {
      const saved = localStorage.getItem('user');
      if (saved) {
        const u = JSON.parse(saved);
        setIsAdmin(u?.role === 1 || u?.role === 3);
      }
    } catch { /* sin sesión */ }

    if (!id) { setLoading(false); return; }

    getProperty(id)
      .then((data) => setProperty(data))
      .catch((err) => console.error('Error cargando propiedad:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Eliminación de instalación ─────────────────────────────────────────────
  const handleDeleteInstallation = (instId: number, name: string) => {
    setConfirm({
      show: true,
      message: `¿Eliminar la instalación "${name}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirm(c => ({ ...c, show: false }));
        try {
          await axiosInstance.delete(`/installation/${instId}`);
          setProperty(p => p ? {
            ...p,
            installations: p.installations.filter(i => i.id !== instId)
          } : p);
        } catch (err) {
          console.error(err);
          alert('No se pudo eliminar la instalación.');
        }
      },
    });
  };

  // ── Eliminación de documentación ───────────────────────────────────────────
  const handleDeleteDoc = (docId: number, type: string, label: string) => {
    const endpointMap: Record<string, string> = {
      insurance: 'insurance',
      plan: 'plans',
      rented: 'rented',
      writing: 'writing',
    };
    setConfirm({
      show: true,
      message: `¿Eliminar el documento "${label}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirm(c => ({ ...c, show: false }));
        try {
          await axiosInstance.delete(`/${endpointMap[type]}/${docId}`);
          setProperty(p => {
            if (!p) return p;
            const key = `${type}s` as keyof Property;
            return {
              ...p,
              [key]: (p[key] as DocBase[]).filter(d => d.id !== docId),
            };
          });
        } catch (err) {
          console.error(err);
          alert('No se pudo eliminar el documento.');
        }
      },
    });
  };

  // ── Render de estado de carga ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
        <p className="text-lg">No se encontró la propiedad.</p>
        <button
          onClick={() => router.push('/')}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const imageUrl = resolveImageUrl(property.file);
  const mapQuery = encodeURIComponent(
    `${property.address}, ${property.locality}, ${property.province}, Argentina`
  );
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed&z=16`;

  // Documentación combinada con tipo
  const allDocs: { item: DocBase; type: string }[] = [
    ...property.writings.map(d => ({ item: d, type: 'writing' })),
    ...property.insurances.map(d => ({ item: d, type: 'insurance' })),
    ...property.plans.map(d => ({ item: d, type: 'plan' })),
    ...property.renteds.map(d => ({ item: d, type: 'rented' })),
  ];

  return (
    <>
      {confirm.show && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(c => ({ ...c, show: false }))}
        />
      )}

      <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
        {/* ── Header con imagen de portada ── */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-800 md:h-72">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt="Imagen de la propiedad"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-20 w-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
              </svg>
            </div>
          )}
          {/* Overlay con degradado */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Botón volver */}
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-300 backdrop-blur-sm transition hover:bg-slate-800"
          >
            ← Volver
          </button>

          {/* Botón editar (admin) */}
          {isAdmin && (
            <button
              onClick={() => router.push(`/property?id=${property.id}`)}
              className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              ✏️ Editar propiedad
            </button>
          )}
        </div>

        {/* ── Contenido principal ── */}
        <div className="mx-auto max-w-5xl px-4 md:px-6">

          {/* Título y clasificación */}
          <div className="-mt-8 mb-6">
            <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
              {property.classification?.name ?? 'Sin clasificación'}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-slate-100 md:text-3xl">
              {property.address}
            </h1>
            <p className="mt-1 text-slate-400">
              {property.locality}, {property.province} · CP {property.postalCode}
            </p>
          </div>

          {/* Grid principal: info + mantenimiento */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* ── Información general ── */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
                Información general
              </h2>
              <dl className="space-y-2.5 text-sm">
                {[
                  ['ID', property.id],
                  ['Código de buen uso', property.goodUseCode],
                  ['Destino', DESTINY_LABELS[String(property.destiny)] ?? property.destiny],
                  ['Estado', STATE_LABELS[property.state] ?? property.state],
                  ['CLFC', CLFC_LABELS[String(property.clfc)] ?? property.clfc],
                  ['Activo', property.active ? 'Sí' : 'No'],
                  ['Entre calles', `${property.betweenStreets1} y ${property.betweenStreets2}`],
                  ['Barrio/Distrito', property.district],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between gap-2 border-b border-slate-800 pb-2">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="text-right font-medium text-slate-200">{String(value)}</dd>
                  </div>
                ))}
                {property.description && (
                  <div className="border-b border-slate-800 pb-2">
                    <dt className="mb-1 text-slate-400">Descripción</dt>
                    <dd className="text-slate-200">{property.description}</dd>
                  </div>
                )}
              </dl>
            </section>

            {/* ── Detalles de mantenimiento ── */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
                Detalles de mantenimiento
              </h2>
              {property.detailsMaintenance ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {property.detailsMaintenance}
                </p>
              ) : (
                <p className="text-sm text-slate-500 italic">Sin detalles registrados.</p>
              )}
            </section>
          </div>

          {/* ── Instalaciones ── */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400">
                Instalaciones ({property.installations.length})
              </h2>
              {isAdmin && (
                <button
                  onClick={() => router.push(`/property?id=${property.id}`)}
                  className="rounded-lg bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/30"
                >
                  + Agregar
                </button>
              )}
            </div>

            {property.installations.length === 0 ? (
              <p className="text-sm italic text-slate-500">No hay instalaciones registradas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Imagen</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Nombre</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Clasificación</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Cantidad</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Detalles</th>
                      {isAdmin && <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {property.installations.map((inst) => {
                      const instImg = resolveImageUrl(inst.file);
                      return (
                        <tr key={inst.id} className="border-b border-slate-800 transition hover:bg-slate-800/40">
                          <td className="py-3 pr-3">
                            {instImg ? (
                              <img
                                src={instImg}
                                alt={inst.name}
                                className="h-10 w-10 rounded-lg object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="py-3 pr-3 font-medium text-slate-200">{inst.name}</td>
                          <td className="py-3 pr-3 text-slate-400">{inst.classification?.name ?? '—'}</td>
                          <td className="py-3 pr-3 text-slate-300">{inst.quantity}</td>
                          <td className="py-3 pr-3 max-w-xs truncate text-slate-400" title={inst.details}>{inst.details || '—'}</td>
                          {isAdmin && (
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => router.push(`/installation/modify-installation?id=${inst.id}&propertyId=${property.id}`)}
                                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                                >
                                  Modificar
                                </button>
                                <button
                                  onClick={() => handleDeleteInstallation(inst.id, inst.name)}
                                  className="rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-900/40"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Documentación ── */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400">
                Documentación ({allDocs.length})
              </h2>
              {isAdmin && (
                <button
                  onClick={() => router.push(`/document-manager?propertyId=${property.id}`)}
                  className="rounded-lg bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/30"
                >
                  + Agregar
                </button>
              )}
            </div>

            {allDocs.length === 0 ? (
              <p className="text-sm italic text-slate-500">No hay documentos registrados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">ID</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Tipo</th>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Detalle</th>
                      {isAdmin && <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {allDocs.map(({ item, type }) => {
                      const label = docTypeLabel(item as any, type);
                      const typeLabels: Record<string, string> = {
                        writing: 'Escritura',
                        insurance: 'Seguro',
                        plan: 'Plano',
                        rented: 'Alquiler',
                      };
                      return (
                        <tr key={`${type}-${item.id}`} className="border-b border-slate-800 transition hover:bg-slate-800/40">
                          <td className="py-3 pr-3 text-slate-400">{item.id}</td>
                          <td className="py-3 pr-3">
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                              {typeLabels[type]}
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-slate-300">{label}</td>
                          {isAdmin && (
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => router.push(`/document-manager?propertyId=${property.id}&docType=${type}&docId=${item.id}`)}
                                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                                >
                                  Modificar
                                </button>
                                <button
                                  onClick={() => handleDeleteDoc(item.id, type, label)}
                                  className="rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-900/40"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Mapa ── */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between bg-slate-900 px-5 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400">
                Ubicación
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 transition hover:text-orange-400"
              >
                Abrir en Maps ↗
              </a>
            </div>
            <div className="h-64 w-full bg-slate-800 md:h-80">
              <iframe
                title="Mapa de la propiedad"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default PropertyView;
