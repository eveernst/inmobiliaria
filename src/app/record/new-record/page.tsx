'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import NewDeed from '@/components/writing/new_writing';
import NewPlan from '@/components/plan/new-plan';
import NewRentedProperty from '@/components/rented-property/new-rented-property';
import NewInsurance from '@/components/insurance/new-insurance';
import NewWriting from '@/components/writing/new_writing';

export default function NewRecord() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };
    return (
        <main className='min-h-screen flex flex-col'>
            <Header />
            {/* <div className="max-w-sm mx-auto"> */}
            <div className="flex-grow flex flex-col">

                <div className="max-w-sm mx-auto">
                    <select id="documentation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleSelectChange} defaultValue=''>
                        <option value="" disabled hidden>Seleccione una opcion</option>
                        <option value="escritura">Escritura</option>
                        <option value="seguroInmueble">Seguro inmueble</option>
                        <option value="inmuebleAlquilado">Inmueble alquilado</option>
                        <option value="planoCasa">Plano de casa</option>
                        <option value="impuestosP">Impuestos Provinciales</option>
                        <option value="impuestosM">Impuestos Municipales</option>
                        <option value="servicios">Servicios</option>
                    </select>
                </div>


                <div className='flex-grow'>
                    {selectedOption === 'escritura' && (<div className="h-full"> <NewWriting /> </div>)}
                    {selectedOption === 'seguroInmueble' && (<div className='h-full'> <NewInsurance /> </div>)}
                    {selectedOption === 'inmuebleAlquilado' && (<div className='h-full'> <NewRentedProperty /> </div>)}
                    {selectedOption === 'planoCasa' && (<div className='h-full'> <NewPlan /> </div>)}
                    {/* {selectedOption === 'impuestosP' && (<div className='h-full'> <NewProvincialTaxes /> </div>)} */}
                    {/* {selectedOption === 'impuestosM' && (<div className='h-full'> <NewMunicipalTaxes /> </div>)} */}
                    {/* {selectedOption === 'servicios' && (<div className='h-full'> <NewServices /> </div>)} */}
                </div>
            </div>
        </main>
    );
}