"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInstallation, InstallationRecord } from "@/api/installationApi";
import { resolveImageUrl } from "@/lib/imageUpload";

const propertyLabel = (installation: InstallationRecord) => {
  const property = installation.property;
  if (!property) return "Sin propiedad asociada";
  return `#${property.id} - ${property.address || "Dirección sin registrar"}`;
};

export default function InstallationDetailPage() {
  const router = useRouter();
  const [installation, setInstallation] = useState<InstallationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      setError("No se indicó una instalación válida.");
      setLoading(false);
      return;
    }

    getInstallation(id)
      .then(setInstallation)
      .catch(() => setError("No se pudo cargar la instalación."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Cargando instalación...</main>;
  }

  if (error || !installation) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-4 text-slate-200">
        <p>{error || "No se encontró la instalación."}</p>
        <button type="button" onClick={() => router.push("/installation")} className="action-button-secondary">
          Volver a instalaciones
        </button>
      </main>
    );
  }

  const imageUrl = resolveImageUrl(installation.file);
  const classification = installation.classification?.name || installation.property?.classification?.name || "Sin clasificación";

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-6 text-slate-100 sm:px-5 md:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">Instalación #{installation.id}</p>
            <h1 className="mt-1 text-3xl font-bold">{installation.name}</h1>
          </div>
          <button type="button" onClick={() => router.push("/installation")} className="action-button-secondary">
            Volver a instalaciones
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex min-h-64 items-center justify-center bg-slate-950">
              {imageUrl ? <img src={imageUrl} alt="" className="h-full max-h-96 w-full object-contain" /> : <span className="text-slate-600">Sin imagen</span>}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-lg font-semibold text-orange-400">Detalles de la instalación</h2>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                <dt className="text-slate-400">Propiedad</dt>
                <dd className="text-right font-medium text-slate-100">{propertyLabel(installation)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                <dt className="text-slate-400">Clasificación</dt>
                <dd className="text-right font-medium text-slate-100">{classification}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                <dt className="text-slate-400">Cantidad</dt>
                <dd className="text-right font-medium text-slate-100">{installation.quantity}</dd>
              </div>
              <div>
                <dt className="mb-2 text-slate-400">Detalles</dt>
                <dd className="whitespace-pre-wrap leading-relaxed text-slate-100">{installation.details || "Sin detalles registrados."}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
