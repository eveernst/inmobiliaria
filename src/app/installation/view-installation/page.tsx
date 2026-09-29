"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/header";
import { getInstallation } from "@/api/installationApi";
import type { Installation } from "@/api/installationApi";

function InstallationDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [installation, setInstallation] = useState<Installation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const installationId = Number(searchParams.get("id"));

    if (!installationId) {
      setError("No se indicó una instalación válida.");
      setLoading(false);
      return;
    }

    getInstallation(installationId)
      .then(setInstallation)
      .catch((loadError) => {
        console.error("Error al cargar instalación:", loadError);
        setError("No se pudo cargar la instalación.");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <Header />
      <div className="mt-7">
        <h1 className="mb-8 text-center text-4xl font-bold text-orange-500">
          Visualizar instalación
        </h1>

        {loading && (
          <p className="py-12 text-center text-gray-300">
            Cargando instalación...
          </p>
        )}
        {error && <p className="py-12 text-center text-red-300">{error}</p>}
        {!loading && !error && installation && (
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 text-xl font-semibold text-orange-400">
                Detalles generales
              </h2>
              <p className="mb-3">
                <strong>Nombre:</strong> {installation.name}
              </p>
              <p className="mb-3">
                <strong>Cantidad:</strong> {installation.quantity}
              </p>
              <p className="mb-3">
                <strong>Clasificación:</strong>{" "}
                {installation.classification?.name ?? "Sin clasificación"}
              </p>
              <p>
                <strong>Archivo:</strong> {installation.file || "Sin archivo"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-800 p-6">
              <h2 className="mb-4 text-xl font-semibold text-orange-400">
                Propiedad asociada
              </h2>
              <p className="mb-3">
                <strong>Dirección:</strong>{" "}
                {installation.property?.address ?? "Sin propiedad"}
              </p>
              <p className="mb-3">
                <strong>Localidad:</strong>{" "}
                {installation.property?.locality ?? "-"}
              </p>
              <p>
                <strong>Provincia:</strong>{" "}
                {installation.property?.province ?? "-"}
              </p>
              <h2 className="mb-2 mt-6 text-xl font-semibold text-orange-400">
                Detalles
              </h2>
              <p className="text-gray-200">{installation.details}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={() => router.push("/installation")}
          className="bg-orange-500 text-white hover:bg-orange-600 px-6 py-3 rounded-md text-lg"
        >
          Volver
        </button>
      </div>
    </main>
  );
}

export default function Installation() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-gray-300">Cargando instalación...</p>}>
      <InstallationDetail />
    </Suspense>
  );
}
