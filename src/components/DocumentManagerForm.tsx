'use client';

import { useState, useEffect, useRef } from "react";
import InsuranceForm from "./documents/insuranceForm";
import WritingForm from "./documents/writingForm";
import PlanForm from "./documents/planForm";
import { usePathname, useRouter } from "next/navigation";
import RentedForm from "./documents/rentedForm";
import { getProperties, getProperty } from "@/api/propertyApi";
import { canWriteProperties } from "@/lib/types";
import UnsavedChangesModal from "./ui/UnsavedChangesModal";
import { SaveBeforeLeave } from "./documents/useUnsavedChanges";

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

// docType as the property detail sends it → tab that edits it.
const DOC_TYPE_TABS: Record<string, string> = {
  insurance: "insurance",
  rented: "rented-property",
  plan: "plan",
  writing: "writing",
};

const DOCUMENT_TYPE_OPTIONS = [
  { value: "insurance", label: "Seguro Inmueble" },
  { value: "rented-property", label: "Inmueble Alquilado" },
  { value: "plan", label: "Plano Casa" },
  { value: "writing", label: "Escritura" },
] as const;

type EditedDocument = { tab: string; id: number; docType: string };

export default function Formulario() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("insurance");
  const [propertyId, setPropertyId] = useState<number>(0);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [editedDocument, setEditedDocument] = useState<EditedDocument | null>(null);
  // Reported by the active document form; "← Volver" asks before dropping them (#77).
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const saveBeforeLeaveRef = useRef<SaveBeforeLeave | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsViewer(!canWriteProperties(parsedUser?.role));
      } catch {
        setIsViewer(false);
      }
    }
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get("propertyId"));
    if (id) setPropertyId(id);

    // "Modificar" from the property detail: /document-manager?propertyId=1&docType=plan&docId=7
    const docType = query.get("docType") ?? "";
    const docTab = DOC_TYPE_TABS[docType];
    const docId = Number(query.get("docId"));
    if (docTab && Number.isInteger(docId) && docId > 0) {
      setActiveTab(docTab);
      setEditedDocument({ tab: docTab, id: docId, docType });
    }
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
    setEditedDocument(null); // the edited document belongs to the previous property
    setIsMenuOpen(false);
    const nextUrl = `${pathname}?propertyId=${encodeURIComponent(String(id))}`;
    router.replace(nextUrl);
  };

  const selectedPropertyListItem = properties.find((item) => item.id === propertyId);

  // One level up (#67): editing returns to that document's view, creating returns to the property.
  const backHref = !propertyId
    ? "/"
    : editedDocument
      ? `/property/details/documentation?id=${propertyId}&docType=${editedDocument.docType}&docId=${editedDocument.id}`
      : `/property/details?id=${propertyId}`;

  const handleBack = () => {
    if (!isViewer && hasUnsavedChanges) {
      setIsLeaveDialogOpen(true);
      return;
    }
    router.push(backHref);
  };

  // Close first: on invalid data the user stays on the form and sees the errors.
  const handleSaveAndLeave = async () => {
    setIsLeaveDialogOpen(false);
    const saved = (await saveBeforeLeaveRef.current?.()) ?? false;
    if (saved) router.push(backHref);
  };

  const handleLeaveWithoutSaving = () => {
    setIsLeaveDialogOpen(false);
    router.push(backHref);
  };

  const renderTabContent = () => {
    if (!propertyId) {
      return (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-8 text-center text-amber-200">
          Seleccioná una propiedad desde el menú superior para ver o cargar su documentación.
        </div>
      );
    }

    // Only the tab of the edited document gets its id; the other tabs create new documents.
    const documentId = editedDocument?.tab === activeTab ? editedDocument.id : undefined;
    const keySuffix = `${propertyId}-${documentId ?? "new"}`;
    const unsavedChangesProps = { onDirtyChange: setHasUnsavedChanges, saveRef: saveBeforeLeaveRef };

    switch (activeTab) {
      case "insurance":
        return <InsuranceForm key={`insurance-${keySuffix}`} propertyId={propertyId} documentId={documentId} isReadOnly={isViewer} {...unsavedChangesProps} />;
      case "rented-property":
        return <RentedForm key={`rented-${keySuffix}`} propertyId={propertyId} documentId={documentId} isReadOnly={isViewer} {...unsavedChangesProps} />;
      case "plan":
        return <PlanForm key={`plan-${keySuffix}`} propertyId={propertyId} documentId={documentId} isReadOnly={isViewer} {...unsavedChangesProps} />;
      case "writing":
        return <WritingForm key={`writing-${keySuffix}`} propertyId={propertyId} documentId={documentId} isReadOnly={isViewer} {...unsavedChangesProps} />;
      default:
        return <InsuranceForm key={`insurance-${keySuffix}`} propertyId={propertyId} isReadOnly={isViewer} {...unsavedChangesProps} />;
    }
  };

  return (
    <div className="page-container py-6">
      <div className="mb-4 flex">
        <button
          type="button"
          onClick={handleBack}
          className="action-button-secondary"
        >
          ← Volver
        </button>
      </div>
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white">
        <h2 className="text-center text-2xl font-bold">Gestor de Documentos</h2>
        {/* <p className="mt-1 text-center text-sm text-slate-300">
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
        </div> */}

        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-center">
          {propertyInfo ? (
            <>
              <p className="text-sm text-slate-200">
                Trabajando en: <span className="font-semibold text-white">{propertyInfo.id} - {propertyInfo.address}</span>
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

      <div className="mb-6 mx-auto w-full max-w-md">
        <label htmlFor="document-type" className="mb-1 block text-sm font-medium text-slate-300">
          Tipo de documentación
        </label>
        <select
          id="document-type"
          value={activeTab}
          onChange={(event) => setActiveTab(event.target.value)}
          // The type of an existing document cannot change while it is edited.
          disabled={editedDocument !== null}
          className="doc-input"
        >
          {DOCUMENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/40 p-3 md:p-4">
        {renderTabContent()}
      </div>

      {isLeaveDialogOpen && (
        <UnsavedChangesModal
          onSave={handleSaveAndLeave}
          onDiscard={handleLeaveWithoutSaving}
          onCancel={() => setIsLeaveDialogOpen(false)}
        />
      )}
    </div>
  );
}
