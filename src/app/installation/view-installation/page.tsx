"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInstallation, InstallationRecord } from "@/api/installationApi";
import { resolveImageUrl } from "@/lib/imageUpload";
import ImageViewModal from "@/components/ui/ImageViewModal";

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
  // Back to the list, keeping the property filter it was opened with (#69).
  const [backHref, setBackHref] = useState("/installation");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const propertyId = Number(query.get("propertyId"));
    if (Number.isInteger(propertyId) && propertyId > 0) {
      setBackHref(`/installation?propertyId=${propertyId}`);
    }

    const id = Number(query.get("id"));
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
        <button type="button" onClick={() => router.push(backHref)} className="action-button-secondary">
          Volver a instalaciones
        </button>
      </main>
    );
  }

  const imageUrl = resolveImageUrl(installation.file);

  return (
    <main className="min-h-screen bg-slate-950 py-6 text-slate-100 md:py-8">
      <div className="page-container">
        <div className="mb-4 flex">
          <button type="button" onClick={() => router.push(backHref)} className="action-button-secondary">
            ← Volver
          </button>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">Instalación #{installation.id}</p>
          <h1 className="mt-1 text-3xl font-bold">{installation.name}</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex min-h-64 items-center justify-center bg-slate-950">
              {imageUrl ? (
                <ImageViewModal imageUrl={imageUrl} imageName={installation.name}>
                  <img src={imageUrl} alt={installation.name} className="h-full max-h-96 w-full object-contain" />
                </ImageViewModal>
              ) : <span className="text-slate-600">Sin imagen</span>}
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
