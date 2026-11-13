"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getInstallations, InstallationRecord } from "@/api/installationApi";
import { resolveImageUrl } from "@/lib/imageUpload";

const propertyLabel = (installation: InstallationRecord) => {
  const property = installation.property;
  if (!property) return "Sin propiedad asociada";
  return `#${property.id} - ${property.address || "Dirección sin registrar"}`;
};

export default function InstallationListPage() {
  const router = useRouter();
  const [installations, setInstallations] = useState<InstallationRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInstallations()
      .then(setInstallations)
      .catch(() => setError("No se pudieron cargar las instalaciones."))
      .finally(() => setLoading(false));
  }, []);

  const filteredInstallations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return installations;

    return installations.filter((installation) =>
      [
        installation.name,
        propertyLabel(installation),
        installation.property?.locality,
        installation.property?.province,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [installations, query]);

  return (
    <main className="min-h-screen bg-slate-950 py-6 text-slate-100 md:py-8">
      <div className="page-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">CU-1.5.5</p>
            <h1 className="mt-1 text-3xl font-bold md:text-4xl">Instalaciones</h1>
            <p className="mt-2 text-slate-400">Listado general de instalaciones asociadas a propiedades.</p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            {filteredInstallations.length} resultados
          </span>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <label htmlFor="installation-search" className="mb-2 block text-sm font-medium text-slate-300">
            Buscar por nombre o propiedad
          </label>
          <input
            id="installation-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, propiedad, localidad o provincia"
            className="doc-input"
          />
        </div>

        {loading && <p className="py-16 text-center text-slate-400">Cargando instalaciones...</p>}
        {!loading && error && <p className="py-16 text-center text-red-300">{error}</p>}
        {!loading && !error && filteredInstallations.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-200">No se encontraron resultados</p>
            <p className="mt-2 text-sm text-slate-400">Probá con otro nombre, propiedad o localidad.</p>
          </div>
        )}

        {!loading && !error && filteredInstallations.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstallations.map((installation) => {
              const imageUrl = resolveImageUrl(installation.file);
              return (
                <button
                  key={installation.id}
                  type="button"
                  onClick={() => router.push(`/installation/view-installation?id=${installation.id}`)}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-0.5 hover:border-orange-500/60"
                >
                  <div className="flex h-36 items-center justify-center bg-slate-950">
                    {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : <span className="text-sm text-slate-600">Sin imagen</span>}
                  </div>
                  <div className="space-y-2 p-4">
                    <h2 className="truncate text-lg font-semibold text-slate-100">{installation.name}</h2>
                    <p className="truncate text-sm text-orange-300">{propertyLabel(installation)}</p>
                    <p className="text-sm text-slate-400">Cantidad: {installation.quantity}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
