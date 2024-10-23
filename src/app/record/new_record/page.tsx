'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import NewDeed from '@/components/deed/new_deed';
import NewPlan from '@/components/plan/new_plan';
import NewRentedProperty from '@/components/rented_property/new_rented_property';

export default function NewRecord() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };
    return (
        <main>
            <Header />

            <div className="max-w-sm mx-auto">
                <h1>Nueva Documentacion</h1>

                <form className="max-w-sm mx-auto">
                    <select id="documentation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleSelectChange} defaultValue=''>
                        <option value="" disabled hidden>Tipo</option>
                        <option value="escritura">Escritura</option>
                        <option value="seguroInmueble">Seguro inmueble</option>
                        <option value="inmuebleAlquilado">Inmueble alquilado</option>
                        <option value="planoCasa">Plano de casa</option>
                        <option value="impuestos">Impuestos</option>
                        <option value="servicios">Servicios</option>
                    </select>
                </form>



                {selectedOption === 'escritura' && (
                    <div>
                        <h2>Formulario para Escritura</h2>
                        <form>
                            {/* Contenido del formulario específico para "Escritura" */}
                            <input type="text" placeholder="Ingrese detalles de la escritura" />
                            <NewDeed />
                        </form>
                    </div>
                )}
                {selectedOption === 'seguroInmueble' && (
                    <div>
                        <h2>Formulario para Seguro Inmueble</h2>
                        <form>
                            {/* Contenido del formulario específico para "Seguro Inmueble" */}
                            <input type="text" placeholder="Ingrese detalles del seguro" />
                        </form>
                    </div>
                )}
                {selectedOption === 'inmuebleAlquilado' && (
                    <div>
                        <h2>Formulario para Inmueble Alquilado</h2>
                        <form>
                            {/* Contenido del formulario específico para "Inmueble Alquilado" */}
                            <input type="text" placeholder="Ingrese detalles del alquiler" />
                            <NewRentedProperty />
                        </form>
                    </div>
                )}
                {selectedOption === 'planoCasa' && (
                    <div>
                        <h2>Formulario para Plano de Casa</h2>
                        <form>
                            {/* Contenido del formulario específico para "Plano de Casa" */}
                            <input type="text" placeholder="Ingrese detalles del plano" />
                            <NewPlan />
                        </form>
                    </div>
                )}
                {selectedOption === 'impuestos' && (
                    <div>
                        <h2>Formulario para Impuestos</h2>
                        <form>
                            {/* Contenido del formulario específico para "Impuestos" */}
                            <input type="text" placeholder="Ingrese detalles de los impuestos" />
                        </form>
                    </div>
                )}
                {selectedOption === 'servicios' && (
                    <div>
                        {/* Contenido del formulario específico para "Servicios" */}
                        <p className='text-4xl text-gray-900 dark:text-white justify-between'>Servicios</p>
                        <form className="max-w-sm mx-auto">
                            <label htmlFor="serviceType-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Servicio</label>
                            <input type="text" id="name-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tipo" required />

                            <label htmlFor="serviceType-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero de cuenta</label>
                            <input type="number" id="name-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Numero de cuenta" required />

                            <label htmlFor="serviceType-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titular</label>
                            <input type="text" id="name-input" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Titular" required />
                        </form>
                    </div>
                )}

            </div>

        </main>
    );
}