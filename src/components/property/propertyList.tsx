"use client";
import React, { useEffect, useState } from 'react';

// Asegúrate de que este tipo coincida con la estructura de tus propiedades
type Property = {
        id: number;
        adress: string;
        classification: string;
        destiny: string;
        detailsMaintenance: string;
        file: string;
        goodUseCode: number;
        description: string;
        province: string;
        locality: string;
        betweenStreets: string;
        postalCode: number;
        district: string;
        destinyUse: string;
        status: string;
        clfc: string;
        securityCodeARM: string;
        state: string;
        innerImage: string;
        outerImage: string;
    };

const PropertyList: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    
    useEffect(() => {
        const fetchProperties = async () => {
            const response = await fetch('/api/properties');
            const data = await response.json();
            setProperties(data);
        };

        fetchProperties();
    }, []);

    return (
        <div>
            <h2>Lista de Propiedades</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Propiedad
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Ubicacion
                                    <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg></a>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    Destino
                                    <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg></a>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Modificar</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Eliminar</span>
                            </th>
                        </tr>
                    </thead>
                <tbody>
                    {properties.map((property) => (
                        <tr key={property.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{property.id}</td>
                            <td className="px-6 py-4">{property.classification}</td>
                            <td className="px-6 py-4">{property.province}</td>
                            <td className="px-6 py-4">{property.destinyUse}</td>
                            <td className="px-6 py-4">{property.status}</td>
                            <td className="px-6 py-4 text-right">
                                <a href={`/property/${property.id}/modify-property`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Modificar</a>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Eliminar</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PropertyList;
