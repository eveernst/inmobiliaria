'use client';

import { getProperties } from '../api/propertyApi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    getProperties().then((data) => {
      console.log(data);
      setProperties(data);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return null; // Loading state
  }

  const isAdmin = user.role === 1;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <header className="text-center mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-400">
              Bienvenido, {user.name} ({isAdmin ? 'Admin' : 'Viewer'})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-2">Propiedades</h1>
        <p className="text-gray-400">Explora las propiedades disponibles</p>
      </header>

      {isAdmin && (
        <button>
          <a
            href="/property"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 inline-block"
          >
            Agregar propiedad
          </a>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
                <p className="text-gray-400 text-sm">
                  {property.locality}, {property.province}
                </p>
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

              {/* Botones con el mismo color */}
              <div className="flex flex-col space-y-3 mt-4">
                {/* Editar */}
                {isAdmin && (
                  <a
                    href={`/property?id=${property.id}`}
                    className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                  >
                    <span className="material-icons-outlined mr-2">Editar</span>
                  </a>
                )}
                {/* Agregar Documentos */}
                {isAdmin && (
                  <a
                    href={`/document-manager?propertyId=${property.id}`}
                    className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                  >
                    <span className="material-icons-outlined mr-2">Agregar Documentos</span>
                  </a>
                )}
                {/* Ver Detalles */}
                <a
                  href={`/property/details?id=${property.id}`}
                  className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                >
                  <span className="material-icons-outlined mr-2">Ver Detalles</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
