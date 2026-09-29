"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Wrench } from "lucide-react";
import { getInstallations, Installation } from "@/api/installationApi";

export default function InstallationList() {
  const router = useRouter();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [propertySearch, setPropertySearch] = useState("");
  const [classificationSearch, setClassificationSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState({
    property: "",
    classification: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInstallations = async () => {
      try {
        setInstallations(await getInstallations());
      } catch (loadError) {
        console.error("Error al cargar instalaciones:", loadError);
        setError("No se pudieron cargar las instalaciones.");
      } finally {
        setLoading(false);
      }
    };

    loadInstallations();
  }, []);

  const filteredInstallations = useMemo(() => {
    const propertyTerm = submittedSearch.property.toLowerCase();
    const classificationTerm = submittedSearch.classification.toLowerCase();

    return installations.filter((installation) => {
      const propertyText = [
        installation.property?.address,
        installation.property?.locality,
        installation.property?.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const classificationText =
        installation.classification?.name?.toLowerCase() ?? "";

      return (
        (!propertyTerm || propertyText.includes(propertyTerm)) &&
        (!classificationTerm || classificationText.includes(classificationTerm))
      );
    });
  }, [installations, submittedSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch({
      property: propertySearch.trim(),
      classification: classificationSearch.trim(),
    });
  };

  const clearSearch = () => {
    setPropertySearch("");
    setClassificationSearch("");
    setSubmittedSearch({ property: "", classification: "" });
  };

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-orange-500">
          Instalaciones
        </h1>

        <form
          onSubmit={handleSearch}
          className="mb-8 grid gap-4 rounded-xl bg-gray-800 p-5 md:grid-cols-[1fr_1fr_auto_auto]"
        >
          <input
            type="search"
            value={propertySearch}
            onChange={(event) => setPropertySearch(event.target.value)}
            placeholder="Buscar por propiedad, dirección o localidad"
            aria-label="Buscar por propiedad"
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400"
          />
          <input
            type="search"
            value={classificationSearch}
            onChange={(event) => setClassificationSearch(event.target.value)}
            placeholder="Buscar por clasificación"
            aria-label="Buscar por clasificación"
            className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold hover:bg-orange-400"
          >
            <Search size={18} /> Buscar
          </button>
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg border border-gray-600 px-5 py-3 font-semibold text-gray-200 hover:bg-gray-700"
          >
            Ver todas
          </button>
        </form>

        {loading && (
          <p className="py-12 text-center text-gray-300">
            Cargando instalaciones...
          </p>
        )}
        {error && <p className="py-12 text-center text-red-300">{error}</p>}
        {!loading && !error && filteredInstallations.length === 0 && (
          <div className="rounded-xl bg-gray-800 px-6 py-16 text-center">
            <Wrench size={52} className="mx-auto mb-4 text-gray-500" />
            <p className="text-xl font-semibold text-gray-200">
              No se encontraron resultados
            </p>
          </div>
        )}

        {!loading && !error && filteredInstallations.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredInstallations.map((installation) => (
              <button
                key={installation.id}
                type="button"
                onClick={() =>
                  router.push(
                    `/installation/view-installation?id=${installation.id}`,
                  )
                }
                className="rounded-xl border border-gray-700 bg-gray-800 p-5 text-left transition hover:border-orange-500 hover:bg-gray-750"
              >
                <h2 className="mb-3 text-xl font-semibold text-orange-400">
                  {installation.name}
                </h2>
                <p className="text-gray-300">
                  Cantidad: {installation.quantity}
                </p>
                <p className="mt-2 text-gray-300">
                  Clasificación:{" "}
                  {installation.classification?.name ?? "Sin clasificación"}
                </p>
                <p className="mt-2 text-gray-400">
                  Propiedad: {installation.property?.address ?? "Sin propiedad"}
                </p>
                <p className="text-sm text-gray-500">
                  {installation.property?.locality},{" "}
                  {installation.property?.province}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
