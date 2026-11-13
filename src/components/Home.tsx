'use client';

import { deleteProperty, getProperties, getProperty, PropertyFilters } from '../api/propertyApi';
import { ClassificationOption, UserData, canWriteProperties } from '@/lib/types';
import { getClassifications } from '@/api/classificationApi';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronDown, HomeIcon, MapPin } from 'lucide-react';
import { extractApiErrorMessage } from '@/lib/formFeedback';
import { PROVINCES } from '@/lib/provinces';
import { getInsurance } from '@/api/insuranceApi';
import { getPlan } from '@/api/planApi';
import { getRented } from '@/api/rentedApi';
import { getWriting } from '@/api/writingApi';
import { deleteImageByPublicUrl, resolveImageUrl } from '@/lib/imageUpload';
import SuccessMessage from '@/components/ui/SuccessMessage';

interface Property {
  id: number;
  province: string;
  address: string;
  locality: string;
  destiny: string;
  active: boolean;
  description: string;
  state?: number;
  classification: {
    id: number;
    name: string;
  };
}

interface Filters {
  locality: string;
  address: string;
  propertyType: string;
  rentalStatus: string;
  ownership: string;
}

interface SearchFormValues extends PropertyFilters {
  province: string;
  classification: string;
  address: string;
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


const emptySearch: SearchFormValues = {
  province: '',
  classification: '',
  address: '',
};

const normalizeProperties = (data: unknown): Property[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((property: Property) => ({
    ...property,
    state: property.state ?? 0,
  }));
};

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchForm, setSearchForm] = useState<SearchFormValues>(emptySearch);
  const [hasSearch, setHasSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [classifications, setClassifications] = useState<ClassificationOption[]>([]);
  const propertyRequestIdRef = useRef(0);
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    locality: '',
    address: '',
    propertyType: '',
    rentalStatus: '',
    ownership: '',
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const localities = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .filter(p => !searchForm.province || p.province === searchForm.province)
          .map(p => p.locality)
      )
    );
  }, [properties, searchForm.province]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const fetchProperties = async () => {
      const requestId = ++propertyRequestIdRef.current;

      try {
        const data = await getProperties();
        if (requestId !== propertyRequestIdRef.current) return;
        setProperties(normalizeProperties(data));
      } catch (error) {
        if (requestId !== propertyRequestIdRef.current) return;
        console.error('Error fetching properties:', error);
        setProperties([]);
      }
    };
    fetchProperties();

    // The back filters by classification id (PropertyFiltersDto @IsInt), so the
    // search offers the real classifications instead of free text.
    getClassifications()
      .then((data: ClassificationOption[]) => setClassifications(data || []))
      .catch(() => setClassifications([]));
  }, [router]);

  const handleSearchChange = (
    field: keyof SearchFormValues,
    value: string,
  ) => {
    setSearchForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    const requestId = ++propertyRequestIdRef.current;

    try {
      const filters: PropertyFilters = {
        province: searchForm.province,
        classification: searchForm.classification,
        address: searchForm.address,
      };
      const data = await getProperties(filters);
      if (requestId !== propertyRequestIdRef.current) return;
      setProperties(normalizeProperties(data));
      setHasSearch(Object.values(filters).some((value) => value?.trim()));
    } catch (error) {
      if (requestId !== propertyRequestIdRef.current) return;
      console.error('Error buscando propiedades:', error);
      setProperties([]);
      setHasSearch(true);
    } finally {
      if (requestId === propertyRequestIdRef.current) {
        setIsSearching(false);
      }
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.locality && property.locality !== filters.locality) return false;
      if (filters.address && !property.address.toLowerCase().includes(filters.address.toLowerCase())) return false;
      if (filters.propertyType && destinyMap[property.destiny] !== filters.propertyType) return false;
      if (filters.rentalStatus === 'rented' && property.state !== 1) return false;
      if (filters.rentalStatus === 'available' && property.state !== 0) return false;
      return true;
    });
  }, [properties, filters]);

  if (!user) {
    return null;
  }

  const isAdmin = canWriteProperties(user.role);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      locality: '',
      address: '',
      propertyType: '',
      rentalStatus: '',
      ownership: '',
    });
  };

  const clearSearch = async () => {
    setSearchForm(emptySearch);
    resetFilters();
    setHasSearch(false);
    setIsSearching(true);
    const requestId = ++propertyRequestIdRef.current;

    try {
      const data = await getProperties();
      if (requestId !== propertyRequestIdRef.current) return;
      setProperties(normalizeProperties(data));
    } catch (error) {
      if (requestId !== propertyRequestIdRef.current) return;
      console.error('Error cargando propiedades:', error);
      setProperties([]);
    } finally {
      if (requestId === propertyRequestIdRef.current) {
        setIsSearching(false);
      }
    }
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
        setSuccessMessage(`Propiedad eliminada. Algunas imágenes (${failedDeletes}) no se pudieron borrar del storage.`);
      } else {
        setSuccessMessage('Propiedad eliminada correctamente.');
      }
    } catch (error) {
      alert(`No se pudo eliminar la propiedad: ${extractApiErrorMessage(error)}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-container pt-5">
        <SuccessMessage message={successMessage} />
      </div>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm py-6">
        <div className="page-container">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
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
                  className="action-button-primary gap-2 shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Nueva Propiedad
                </a>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="search"
              value={searchForm.address}
              onChange={(event) => handleSearchChange('address', event.target.value)}
              placeholder="Buscar por dirección"
              aria-label="Buscar por dirección"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:outline-none"
            />
            <select
              value={searchForm.classification}
              onChange={(event) => handleSearchChange('classification', event.target.value)}
              aria-label="Filtrar por clasificación"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-orange-500 focus:outline-none"
            >
              <option value="">Todas las clasificaciones</option>
              {classifications.map((classification) => (
                <option key={classification.id} value={String(classification.id)}>
                  {classification.name}
                </option>
              ))}
            </select>
            <select
              value={searchForm.province}
              onChange={(event) => handleSearchChange('province', event.target.value)}
              aria-label="Filtrar por provincia"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-orange-500 focus:outline-none"
            >
              <option value="">Todas las provincias</option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSearching}
                className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                type="button"
                onClick={clearSearch}
                disabled={isSearching}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Ver todas
              </button>
            </div>
          </form>

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
        <div className="border-b border-slate-800 bg-slate-900/60 py-6">
          <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Locality Filter */}
              <div>
                <label htmlFor="filter-locality" className="block text-sm font-semibold text-slate-300 mb-2">Localidad</label>
                <select
                  id="filter-locality"
                  value={filters.locality}
                  onChange={(e) => handleFilterChange('locality', e.target.value)}
                  disabled={!searchForm.province}
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
                <label htmlFor="filter-address" className="block text-sm font-semibold text-slate-300 mb-2">Dirección</label>
                <input
                  id="filter-address"
                  type="text"
                  value={filters.address}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  placeholder="Buscar por dirección..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Property Type Filter */}
              <div>
                <label htmlFor="filter-type" className="block text-sm font-semibold text-slate-300 mb-2">Tipo de inmueble</label>
                <select
                  id="filter-type"
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
                <label htmlFor="filter-rental" className="block text-sm font-semibold text-slate-300 mb-2">Estado de alquiler</label>
                <select
                  id="filter-rental"
                  value={filters.rentalStatus}
                  onChange={(e) => handleFilterChange('rentalStatus', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Cualquier estado</option>
                  <option value="available">Disponible</option>
                  <option value="rented">Alquilado</option>
                </select>
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
      <div className="py-8">
        <div className="page-container">
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
                      <a
                        href={`/property/details?id=${property.id}`}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-lg transition border border-slate-700"
                      >
                        Detalles
                      </a>
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
              <p className="text-slate-300 text-lg font-medium mb-2">
                {hasSearch ? 'No se encontraron resultados' : 'No se encontraron propiedades'}
              </p>
              <p className="text-slate-500 mb-6">
                {hasSearch ? 'Probá con otros criterios de búsqueda' : 'Probá ajustando los filtros'}
              </p>
              <button
                onClick={clearSearch}
                disabled={isSearching}
                className="bg-orange-500 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 text-white font-semibold py-2 px-8 rounded-lg transition shadow-md"
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
