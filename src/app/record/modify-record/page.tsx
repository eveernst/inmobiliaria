"use client";

import React, { useState } from 'react';
import Header from "../../../components/header";
import NewPlan from '@/components/plan/new-plan';
import NewRentedProperty from '@/components/rented-property/new-rented-property';
import ModifyInsurance from '@/components/insurance/modify-insurance';
import ModifyWriting from '@/components/writing/modify_writing';
import ModifyRentedProperty from '@/components/rented-property/modify-rented-property';
import ModifyPlan from '@/components/plan/modify-plan';

export default function ModifyRecord() {
  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
};
  // const renderDocumentContent = () => {
  //   switch (documentType) {
  //     case 'escritura':
  //       return <ModifyWriting />;
  //     case 'seguro':
  //       return <ModifyInsurance />;
  //     case 'inmueble':
  //       return <ModifyRentedProperty />;
  //     case 'plano':
  //       return <ModifyPlan />;
  //     case 'servicios':
  //       // return <ModifyServices />;
  //     case 'impuestosP':
  //       // return <ModifyProvincialTaxes />;
  //     case 'impuestosM':
  //       // return <ModifyMunicipalTaxes />;
  //     default:
  //       return <p className="text-gray-400">Por favor, selecciona un tipo de documento.</p>;
    // }
  // };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">Modificar Documentación</h1>
        
        <div className="w-full max-w-md mb-8">
          <select id="documentation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleSelectChange} defaultValue=''>
            <option value="" disabled hidden>Tipo</option>
            <option value="escritura">Escritura</option>
            <option value="seguro">Seguro inmueble</option>
            <option value="inmueble">Inmueble alquilado</option>
            <option value="plano">Plano de casa</option>
            <option value="servicios">Servicios</option>
            <option value="impuestosP">Impuestos provinciales</option>
            <option value="impuestosM">Impuestos municipales</option>
          </select>
        </div>

        {selectedOption === 'escritura' && <ModifyWriting />}
        {selectedOption === 'seguro' && <ModifyInsurance />}
        {selectedOption === 'inmueble' && <ModifyRentedProperty />}
        {selectedOption === 'plano' && <ModifyPlan />}
        {/* {selectedOption === 'servicios' && <ModifyServices />} */}
        {/* {selectedOption === 'impuestosP' && <ModifyProvincialTaxes />} */}
        {/* {selectedOption === 'impuestosM' && <ModifyMunicipalTaxes />} */}

        <div className="flex justify-center space-x-8 mt-12">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-12 py-3 rounded-md">
            Cancelar
          </button>
          <button className="bg-gray-600 text-white hover:bg-gray-700 px-12 py-3 rounded-md">
            Aceptar
          </button>
        </div>
      </div>
    </main>
  );
}
