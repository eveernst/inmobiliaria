'use client';

import { useState } from "react";
import SeguroInmueble from "../components/documents/insuranceForm";
import Escritura from "../components/documents/writingForm";
import InmuebleAlquilado from "../components/documents/rentedForm";
import PlanoCasa from "../components/documents/planForm";

export default function Formulario() {
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState("seguro-inmueble");
  // const [propertyId, setPropertyId] = useState(null);

  // useEffect(() => {
  //   const query = new URLSearchParams(window.location.search);
  //   const id = query.get("id");
  //   if (id) setPropertyId(id);
  // }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "seguro-inmueble":
        return <SeguroInmueble />;
      case "inmueble-alquilado":
        return <InmuebleAlquilado />;
      case "plano-casa":
        return <PlanoCasa />;
      case "escritura":
        return <Escritura />;
      default:
        return <SeguroInmueble />;
    }
  };

  return (
    <div className="p-4">
      {/* Contenedor de Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded ${activeTab === "seguro-inmueble" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("seguro-inmueble")}
        >
          Seguro Inmueble
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "inmueble-alquilado" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("inmueble-alquilado")}
        >
          Inmueble Alquilado
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "plano-casa" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("plano-casa")}
        >
          Plano Casa
        </button>
        <button
          className={`py-2 px-4 rounded ${activeTab === "escritura" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("escritura")}
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
