'use client';

import { useState, useEffect } from "react";
import InsuranceForm from "./documents/insuranceForm";
import WritingForm from "./documents/writingForm";
import PlanForm from "./documents/planForm";
import { usePathname, useRouter } from "next/navigation";
import RentedForm from "./documents/rentedForm";
import { getProperties, getProperty } from "@/api/propertyApi";
import { set } from "react-hook-form";

type PropertyListItem = {
  id: number;
  address: string;
  locality: string;
  province: string;
};

type PropertyInfo = {
  id: number;
  address: string;
  locality: string;
  province: string;
  classification?: { name?: string };
};

export default function Formulario() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("insurance");
  const [propertyId, setPropertyId] = useState<number>(0);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewer, setIsViewer] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsViewer(parsedUser?.role !== 1);
      } catch {
        setIsViewer(false);
      }
    }
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get("propertyId"));
    if (id) setPropertyId(id);
    // route example: /document-manager?propertyId=123
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("No se pudo cargar el listado de propiedades:", error);
        setProperties([]);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    if (!propertyId && properties.length > 0) {
      setIsMenuOpen(true);
    }
  }, [propertyId, properties.length]);

  useEffect(() => {
    if (!propertyId) {
      setPropertyInfo(null);
      return;
    }

    const loadPropertyInfo = async () => {
      try {
        const data = await getProperty(propertyId);
        setPropertyInfo({
          id: data.id,
          address: data.address,
          locality: data.locality,
          province: data.province,
          classification: data.classification,
        });
      } catch (error) {
        console.error("No se pudo cargar la propiedad del gestor documental:", error);
        setPropertyInfo(null);
      }
    };

    loadPropertyInfo();
  }, [propertyId]);

  const handlePropertySelect = (id: number) => {
    setPropertyId(id);
    setIsMenuOpen(false);
    const nextUrl = `${pathname}?propertyId=${encodeURIComponent(String(id))}`;
    router.replace(nextUrl);
  };

  const selectedPropertyListItem = properties.find((item) => item.id === propertyId);

  const renderTabContent = () => {
    if (!propertyId) {
      return (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-8 text-center text-amber-200">
          Seleccioná una propiedad desde el menú superior para ver o cargar su documentación.
        </div>
      );
    }

    switch (activeTab) {
      case "insurance":
        return <InsuranceForm key={`insurance-${propertyId}`} propertyId={propertyId} isReadOnly={isViewer} />;
      case "rented-property":
        return <RentedForm key={`rented-${propertyId}`} propertyId={propertyId} isReadOnly={isViewer} />;
      case "plan":
        return <PlanForm key={`plan-${propertyId}`} propertyId={propertyId} isReadOnly={isViewer} />;
      case "writing":
        return <WritingForm key={`writing-${propertyId}`} propertyId={propertyId} isReadOnly={isViewer} />;
      default:
        return <InsuranceForm key={`insurance-${propertyId}`} propertyId={propertyId} isReadOnly={isViewer} />;
    }
  };

  return (
    <div className="mx-0 w-full px-4 py-6 md:px-8">
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white">
        <h2 className="text-center text-2xl font-bold">Gestor de Documentos</h2>
        <p className="mt-1 text-center text-sm text-slate-300">
          Elegí una propiedad para trabajar con Seguro, Alquiler, Plano y Escritura.
        </p>

        <div className="relative mt-5 w-full">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-left text-sm text-white transition hover:border-sky-400"
          >
            <span>
              {selectedPropertyListItem
                ? `#${selectedPropertyListItem.id} - ${selectedPropertyListItem.address} (${selectedPropertyListItem.locality}, ${selectedPropertyListItem.province})`
                : "Seleccionar propiedad"}
            </span>
            <span className="text-slate-300">{isMenuOpen ? "Cerrar" : "Abrir"}</span>
          </button>

          {isMenuOpen && (
            <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-2xl ring-1 ring-slate-500/30">
              {properties.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-300">No hay propiedades disponibles.</p>
              )}

              {properties.map((property) => {
                const isSelected = property.id === propertyId;

                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => handlePropertySelect(property.id)}
                    className={`w-full border-b border-slate-700 px-4 py-3 text-left text-sm transition last:border-b-0 ${isSelected ? "bg-sky-700/40 text-white" : "text-slate-200 hover:bg-slate-700"
                      }`}
                  >
                    <p className="font-medium">#{property.id} - {property.address}</p>
                    <p className="text-xs text-slate-300">{property.locality}, {property.province}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-center">
          {propertyInfo ? (
            <>
              <p className="text-sm text-slate-200">
                Trabajando en: <span className="font-semibold text-white">#{propertyInfo.id} - {propertyInfo.address}</span>
              </p>
              <p className="text-xs text-slate-300">
                {propertyInfo.locality}, {propertyInfo.province} | Clasificación: {propertyInfo.classification?.name || "Sin clasificación"}
              </p>
            </>
          ) : (
            <p className="text-sm text-amber-300">
              No hay propiedad seleccionada. Abrí el menú y elegí una propiedad.
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <button
          className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${activeTab === "insurance" ? "border-sky-400 bg-sky-500 text-white " : "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
          onClick={() => setActiveTab("insurance")}
        >
          Seguro Inmueble
        </button>
        <button
          className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${activeTab === "rented-property" ? "border-sky-400 bg-sky-500 text-white " : "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
          onClick={() => setActiveTab("rented-property")}
        >
          Inmueble Alquilado
        </button>
        <button
          className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${activeTab === "plan" ? "border-sky-400 bg-sky-500 text-white " : "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
          onClick={() => setActiveTab("plan")}
        >
          Plano Casa
        </button>
        <button
          className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${activeTab === "writing" ? "border-sky-400 bg-sky-500 text-white " : "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
          onClick={() => setActiveTab("writing")}
        >
          Escritura
        </button>
      </div>

      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-3 md:p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}
