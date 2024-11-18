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

  const toggleActive = (id: number) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, active: !property.active } : property
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Propiedades</h1>
        <p className="text-gray-400">Explora las propiedades disponibles</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
              <p className="text-gray-400 text-sm">{property.locality}, {property.province}</p>
              <p className="mt-2">{property.destiny}</p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`font-medium ${property.active ? 'text-green-400' : 'text-red-400'}`}
                >
                  {property.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <p className="text-gray-400 mt-4">{property.description}</p>
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
