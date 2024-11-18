'use client';
import { getProperties } from '../api/propertyApi';
import { useEffect, useState } from 'react';

interface Property {
  province: string;
  address: string;
  locality: string;
  destiny: string;
  active: boolean;
  description: string;
  classification: {
    id: number;
    name: string;
  };
  id: number;
}

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties().then((data) => {
      console.log(data);
      setProperties(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Propiedades</h1>
        <p className="text-gray-400">Explora las propiedades disponibles</p>
      </header>

      <button>
        <a href="/property" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 inline-block">
          Agregar propiedad
        </a>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="p-4 space-y-4">
              <div className="space-x-4">
                {/* Editar */}
                <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">
                  <a href={`/property?id=${property.id}`}>Editar</a>
                </button>
                <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">
                  <a href={`/document-manager?propertyId=${property.id}`}>Agregar Documentos</a>
                </button>
                <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600">
                  <a href={`/property/${property.id}/details`}>Ver detalles</a>
                </button>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                <p className="text-gray-400 text-sm">{property.locality}, {property.province}</p>
                <p className="mt-2">{property.destiny}</p>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    className={`px-3 py-1 text-sm font-medium rounded-full focus:outline-none ${
                      property.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {property.active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>

                <p className="text-gray-400 mt-4">{property.description}</p>
              </div>

              <div className="mt-4">
                <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-full">
                  Clasificación: {property.classification.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
