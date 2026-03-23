'use client';

import { useState, useEffect } from "react";
import InsuranceForm from "../components/documents/insuranceForm";
import WritingForm from "../components/documents/writingForm";
import PlanForm from "../components/documents/planForm";
import { useRouter } from "next/navigation";
import RentedForm from "./documents/rentedForm";

export default function Formulario() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("insurance");
  const [propertyId, setPropertyId] = useState<number>(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get("propertyId"));
    const tab = query.get("tab");
    if (id) setPropertyId(id);
    if (tab) setActiveTab(tab);
    // route example: /document-manager?propertyId=123&tab=writing
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "insurance":
        return <InsuranceForm propertyId={ propertyId } />;
      case "rented-property":
        return <RentedForm propertyId={ propertyId } />;
      case "plan":
        return <PlanForm propertyId={ propertyId } />;
      case "writing":
        return <WritingForm propertyId={ propertyId } />;
      default:
        return <InsuranceForm propertyId={ propertyId } />;
    }
  };

  return (
    <div className="p-4">
      {/* Contenedor de Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded ${activeTab === "insurance" ? "bg-blue-500 text-white" : "bg-slate-700"}`}
          onClick={() => setActiveTab("insurance")}
        >
          Seguro Inmueble
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "rented-property" ? "bg-blue-500 text-white" : "bg-slate-700"}`}
          onClick={() => setActiveTab("rented-property")}
        >
          Inmueble Alquilado
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "plan" ? "bg-blue-500 text-white" : "bg-slate-700"}`}
          onClick={() => setActiveTab("plan")}
        >
          Plano Casa
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "writing" ? "bg-blue-500 text-white" : "bg-slate-700"}`}
          onClick={() => setActiveTab("writing")}
        >
          Escritura
        </button>
      </div>

      {/* Contenido del Tab activo */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}
