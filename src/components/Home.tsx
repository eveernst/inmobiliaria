'use client';

import { deleteProperty, getProperties, getProperty } from '../api/propertyApi';
import { UserData } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronDown, HomeIcon, MapPin, DollarSign } from 'lucide-react';
import { extractApiErrorMessage } from '@/lib/formFeedback';
import { getInsurance } from '@/api/insuranceApi';
import { getPlan } from '@/api/planApi';
import { getRented } from '@/api/rentedApi';
import { getWriting } from '@/api/writingApi';
import { deleteImageByPublicUrl, resolveImageUrl } from '@/lib/imageUpload';

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
  const [user, setUser] = useState<UserData | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();
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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

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
  }, [router]);

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

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 1;

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
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

  const handleDeleteProperty = async (property: Property) => {
    interface InstallationRef {
      file?: string;
    }

    interface PropertyDocument {
      property?: { id: number };
      propertyId?: number;
      insuranceImage?: string;
      AnualFormImage?: string;
      anualFormImage?: string;
      planImage?: string;
      structureImage?: string;
      gasImage?: string;
      waterImage?: string;
      lightImage?: string;
      projectImage?: string;
      finalImage?: string;
      stateImage?: string;
      imageVisado?: string;
      contractImage?: string;
      imageJDAAC?: string;
      imageJDUA?: string;
      interiorImage?: string;
      exteriorImage?: string;
    }

    const confirmed = window.confirm(
      `Vas a eliminar la propiedad ${property.address} (${property.locality}, ${property.province}) y toda su documentación asociada. Esta acción no se puede deshacer. ¿Deseas continuar?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(property.id);

      const imageUrls = new Set<string>();

      try {
        const propertyDetails = await getProperty(property.id);
        if (propertyDetails?.file) {
          imageUrls.add(resolveImageUrl(propertyDetails.file));
        }
        (propertyDetails?.installations || []).forEach((installation: InstallationRef) => {
          if (installation?.file) {
            imageUrls.add(resolveImageUrl(installation.file));
          }
        });
      } catch (error) {
        console.error('No se pudo obtener detalle de propiedad para borrar imagenes:', error);
      }

      const [insuranceRes, planRes, rentedRes, writingRes] = await Promise.allSettled([
        getInsurance(),
        getPlan(),
        getRented(),
        getWriting(),
      ]);

      if (insuranceRes.status === 'fulfilled') {
        const insurances = Array.isArray(insuranceRes.value) ? insuranceRes.value : [];
        insurances
          .filter((item: PropertyDocument) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: PropertyDocument) => {
            if (item?.insuranceImage) {
              imageUrls.add(resolveImageUrl(item.insuranceImage));
            }
            if (item?.AnualFormImage) {
              imageUrls.add(resolveImageUrl(item.AnualFormImage));
            }
            if (item?.anualFormImage) {
              imageUrls.add(resolveImageUrl(item.anualFormImage));
            }
          });
      }

      if (planRes.status === 'fulfilled') {
        const plans = Array.isArray(planRes.value) ? planRes.value : [];
        plans
          .filter((item: PropertyDocument) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: PropertyDocument) => {
            [
              item?.planImage,
              item?.structureImage,
              item?.gasImage,
              item?.waterImage,
              item?.lightImage,
              item?.projectImage,
              item?.finalImage,
              item?.stateImage,
              item?.imageVisado,
            ].forEach((url) => {
              if (url) {
                imageUrls.add(resolveImageUrl(url));
              }
            });
          });
      }

      if (rentedRes.status === 'fulfilled') {
        const renteds = Array.isArray(rentedRes.value) ? rentedRes.value : [];
        renteds
          .filter((item: PropertyDocument) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: PropertyDocument) => {
            if (item?.contractImage) {
              imageUrls.add(resolveImageUrl(item.contractImage));
            }
          });
      }

      if (writingRes.status === 'fulfilled') {
        const writings = Array.isArray(writingRes.value) ? writingRes.value : [];
        writings
          .filter((item: PropertyDocument) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: PropertyDocument) => {
            [item?.imageJDAAC, item?.imageJDUA, item?.interiorImage, item?.exteriorImage].forEach((url) => {
              if (url) {
                imageUrls.add(resolveImageUrl(url));
              }
            });
          });
      }

      const deletions = await Promise.allSettled(
        Array.from(imageUrls)
          .filter(Boolean)
          .map((url) => deleteImageByPublicUrl(url))
      );

      const failedDeletes = deletions.filter(
        (result) => result.status === 'rejected' || result.value === false
      ).length;

      await deleteProperty(property.id);
      setProperties((prev) => prev.filter((item) => item.id !== property.id));

      if (failedDeletes > 0) {
        alert(`Propiedad eliminada. Algunas imágenes (${failedDeletes}) no se pudieron borrar del storage.`);
      } else {
        alert('Propiedad eliminada con toda su información asociada, incluyendo imágenes.');
      }
    } catch (error) {
      alert(`No se pudo eliminar la propiedad: ${extractApiErrorMessage(error)}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Propiedades</h1>
              <p className="text-slate-400">
                Bienvenido, {user.name} ({isAdmin ? 'Admin' : 'Viewer'})
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <a
                  href="/property"
                  className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Nueva Propiedad
                </a>
              )}
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg transition border border-slate-700"
          >
            <ChevronDown size={20} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-semibold">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-b border-slate-800 bg-slate-900/60 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Province Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Provincia</label>
                <select
                  value={filters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todas las provincias</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              {/* Locality Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Localidad</label>
                <select
                  value={filters.locality}
                  onChange={(e) => handleFilterChange('locality', e.target.value)}
                  disabled={!filters.province}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-900"
                >
                  <option value="">Todas las localidades</option>
                  {localities.map(locality => (
                    <option key={locality} value={locality}>{locality}</option>
                  ))}
                </select>
              </div>

              {/* Address Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Dirección</label>
                <input
                  type="text"
                  value={filters.address}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  placeholder="Buscar por dirección..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Tipo de inmueble</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                <label className="block text-sm font-semibold text-slate-300 mb-2">Estado de alquiler</label>
                <select
                  value={filters.rentalStatus}
                  onChange={(e) => handleFilterChange('rentalStatus', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Cualquier estado</option>
                  <option value="available">Disponible</option>
                  <option value="rented">Alquilado</option>
                </select>
              </div>

              {/* For Sale Filter */}
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 w-full hover:bg-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={filters.forSale}
                    onChange={(e) => handleFilterChange('forSale', e.target.checked)}
                    className="w-4 h-4 cursor-pointer text-orange-500 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Para vender</span>
                </label>
              </div>

              {/* Reset Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg transition border border-slate-700"
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
            <p className="text-slate-400 font-medium">
              Mostrando <span className="text-orange-400 font-bold">{filteredProperties.length}</span> de <span className="text-orange-400 font-bold">{properties.length}</span> propiedades
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden relative border-b border-slate-800">
                    <div className="text-center z-10">
                      <HomeIcon size={48} className="text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm font-medium">Foto de propiedad</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 leading-tight">{property.address}</h2>
                      <div className="flex items-start gap-2 text-slate-400 text-sm mb-3">
                        <MapPin size={16} className="flex-shrink-0 mt-0.5 text-orange-400" />
                        <div>
                          <p className="font-medium text-slate-300">{property.locality}</p>
                          <p className="text-slate-500">{property.province}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-300 rounded-full border border-orange-500/30">
                        {destinyMap[property.destiny] || property.destiny}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${property.active ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                        {property.active ? 'Activo' : 'Inactivo'}
                      </span>
                      {property.state === 1 && (
                        <span className="px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/30">
                          Alquilado
                        </span>
                      )}
                      {property.forSale && (
                        <span className="px-3 py-1 text-xs font-semibold bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/30 flex items-center gap-1">
                          <DollarSign size={12} />
                          Para vender
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {property.description && (
                      <p className="text-slate-400 text-sm line-clamp-2">{property.description}</p>
                    )}

                    {/* Classification */}
                    <div className="pt-3 border-t border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Clasificación</p>
                      <p className="text-sm font-semibold text-slate-200">{property.classification?.name}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-4">
                      {isAdmin && (
                        <a
                          href={`/property?id=${property.id}`}
                          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition shadow-sm hover:shadow-md"
                        >
                          Editar
                        </a>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`/property/details?id=${property.id}`}
                          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg transition border border-slate-700"
                        >
                          Detalles
                        </a>
                        {isAdmin && (
                          <a
                            href={`/document-manager?propertyId=${property.id}`}
                            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg transition border border-slate-700"
                          >
                            Docs
                          </a>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(property)}
                          disabled={deletingId === property.id}
                          className="flex items-center justify-center gap-2 bg-red-700/80 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
                        >
                          {deletingId === property.id ? 'Eliminando...' : 'Eliminar propiedad'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
              <HomeIcon size={56} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-300 text-lg font-medium mb-2">No se encontraron propiedades</p>
              <p className="text-slate-500 mb-6">Prueba ajustando los filtros</p>
              <button
                onClick={resetFilters}
                className="bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 px-8 rounded-lg transition shadow-md"
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
