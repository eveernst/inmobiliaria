'use client';

import { getProperties } from '../api/propertyApi';
import { useEffect, useState, useMemo } from 'react';
import { Plus, ChevronDown, HomeIcon, MapPin, DollarSign } from 'lucide-react';

interface Property {
  id: number;
  province: string;
  address: string;
  locality: string;
  destiny: string;
  active: boolean;
  description: string;
  state?: number;
  forSale?: boolean;
  classification: {
    id: number;
    name: string;
  };
}

interface Filters {
  province: string;
  locality: string;
  address: string;
  propertyType: string;
  rentalStatus: string;
  ownership: string;
  forSale: boolean;
}

const destinyMap: { [key: string]: string } = {
  '0': 'Templo',
  '1': 'Terreno',
  '2': 'Antena',
  '3': 'Casa',
  '4': 'Departamento',
  '5': 'Instituciones Educativas',
  '6': 'Predio',
  '7': 'Otro'
};

const provinces: string[] = [
  'Córdoba',
  'Santa Fe',
  'Entre Ríos',
] as const;

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filters>({
    province: '',
    locality: '',
    address: '',
    propertyType: '',
    rentalStatus: '',
    ownership: '',
    forSale: false,
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const localities = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .filter(p => !filters.province || p.province === filters.province)
          .map(p => p.locality)
      )
    );
  }, [properties, filters.province]);

  useEffect(() => {
    // getProperties().then((data) => {
    //   console.log(data);
    //   setProperties(data);
    // });
    const fetchProperties = async () => {
      try {
        const data = await getProperties();

        const normalizedData = data.map((p: Property) => ({
          ...p,
          state: p.state ?? 0,
          forSale: p.forSale ?? false,
        }));
        setProperties(normalizedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.province && property.province !== filters.province) return false;
      if (filters.locality && property.locality !== filters.locality) return false;
      if (filters.address && !property.address.toLowerCase().includes(filters.address.toLowerCase())) return false;
      if (filters.propertyType && destinyMap[property.destiny] !== filters.propertyType) return false;
      if (filters.rentalStatus === 'rented' && property.state !== 1) return false;
      if (filters.rentalStatus === 'available' && property.state !== 0) return false;
      if (filters.forSale && !property.forSale) return false;
      return true;
    });
  }, [properties, filters]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset dependent filters
      ...(key === 'province' && { locality: '' })
    }));
  };

  const resetFilters = () => {
    setFilters({
      province: '',
      locality: '',
      address: '',
      propertyType: '',
      rentalStatus: '',
      ownership: '',
      forSale: false
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== false).length;



  //   return (
  //     <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
  //       <header className="text-center mb-10">
  //         <h1 className="text-4xl font-bold mb-2">Propiedades</h1>
  //         <p className="text-gray-400">Explora las propiedades disponibles</p>
  //       </header>

  //       <button>
  //         <a
  //           href="/property"
  //           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 inline-block"
  //         >
  //           Agregar propiedad
  //         </a>
  //       </button>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  //         {properties.map((property: Property) => (
  //           <div
  //             key={property.id}
  //             className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
  //           >
  //             <div className="p-4 space-y-4">
  //               <div>
  //                 <h2 className="text-xl font-semibold mb-2">{property.address}</h2>
  //                 <p className="text-gray-400 text-sm">
  //                   {property.locality}, {property.province}
  //                 </p>
  //                 <p className="mt-2">{property.destiny}</p>

  //                 <div className="mt-4 flex items-center justify-between">
  //                   <button
  //                     className={`px-3 py-1 text-sm font-medium rounded-full focus:outline-none ${
  //                       property.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  //                     }`}
  //                   >
  //                     {property.active ? 'Activo' : 'Inactivo'}
  //                   </button>
  //                 </div>

  //                 <p className="text-gray-400 mt-4">{property.description}</p>
  //               </div>

  //               <div className="mt-4">
  //                 <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-full">
  //                   Clasificación: {property.classification.name}
  //                 </span>
  //               </div>

  //               {/* Botones con el mismo color */}
  //               <div className="flex flex-col space-y-3 mt-4">
  //                 {/* Editar */}
  //                 <a
  //                   href={`/property?id=${property.id}`}
  //                   className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
  //                 >
  //                   <span className="material-icons-outlined mr-2">Editar</span>
  //                 </a>
  //                 {/* Agregar Documentos */}
  //                 <a
  //                   href={`/document-manager?propertyId=${property.id}`}
  //                   className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
  //                 >
  //                   <span className="material-icons-outlined mr-2">Agregar Documentos</span>
  //                 </a>
  //                 {/* Ver Detalles */}
  //                 <a
  //                   href={`/property/details?id=${property.id}`}
  //                   className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
  //                 >
  //                   <span className="material-icons-outlined mr-2">Ver Detalles</span>
  //                 </a>
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // export default Home;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Propiedades</h1>
              <p className="text-slate-500">Explora y gestiona todas tus propiedades</p>
            </div>
            <a
              href="/property"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Nueva Propiedad
            </a>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
          >
            <ChevronDown size={20} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-semibold">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Province Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Provincia</label>
                <select
                  value={filters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las provincias</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* Locality Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Localidad</label>
                <select
                  value={filters.locality}
                  onChange={(e) => handleFilterChange('locality', e.target.value)}
                  disabled={!filters.province}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="">Todas las localidades</option>
                  {localities.map(locality => (
                    <option key={locality} value={locality}>{locality}</option>
                  ))}
                </select>
              </div>

              {/* Address Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={filters.address}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  placeholder="Buscar por dirección..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de inmueble</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Casa">Casa</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Templo">Iglesia/Templo</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Predio">Predio</option>
                  <option value="Instituciones Educativas">Instituciones Educativas</option>
                  <option value="Antena">Antena</option>
                </select>
              </div>

              {/* Rental Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estado de alquiler</label>
                <select
                  value={filters.rentalStatus}
                  onChange={(e) => handleFilterChange('rentalStatus', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Cualquier estado</option>
                  <option value="available">Disponible</option>
                  <option value="rented">Alquilado</option>
                </select>
              </div>

              {/* For Sale Filter */}
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 w-full hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={filters.forSale}
                    onChange={(e) => handleFilterChange('forSale', e.target.checked)}
                    className="w-4 h-4 cursor-pointer text-blue-600 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-700">Para vender</span>
                </label>
              </div>

              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <p className="text-slate-600 font-medium">
              Mostrando <span className="text-blue-600 font-bold">{filteredProperties.length}</span> de <span className="text-blue-600 font-bold">{properties.length}</span> propiedades
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-slate-100"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                    <div className="text-center z-10">
                      <HomeIcon size={56} className="text-blue-300 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm font-medium">Foto de propiedad</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Address */}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{property.address}</h2>
                      <div className="flex items-start gap-2 text-slate-600 text-sm mb-3">
                        <MapPin size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
                        <div>
                          <p className="font-medium">{property.locality}</p>
                          <p className="text-slate-500">{property.province}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {destinyMap[property.destiny] || property.destiny}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${property.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {property.active ? 'Activo' : 'Inactivo'}
                      </span>
                      {property.state === 1 && (
                        <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                          Alquilado
                        </span>
                      )}
                      {property.forSale && (
                        <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                          <DollarSign size={12} />
                          Para vender
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {property.description && (
                      <p className="text-slate-600 text-sm line-clamp-2">{property.description}</p>
                    )}

                    {/* Classification */}
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Clasificación</p>
                      <p className="text-sm font-semibold text-slate-900">{property.classification.name}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-4">
                      <a
                        href={`/property?id=${property.id}`}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition shadow-sm hover:shadow-md"
                      >
                        Editar
                      </a>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`/property/details?id=${property.id}`}
                          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                        >
                          Detalles
                        </a>
                        <a
                          href={`/document-manager?propertyId=${property.id}`}
                          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
                        >
                          Docs
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
              <HomeIcon size={56} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium mb-2">No se encontraron propiedades</p>
              <p className="text-slate-500 mb-6">Prueba ajustando los filtros</p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-8 rounded-lg transition shadow-md"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
