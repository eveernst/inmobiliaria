'use client';

import { deleteProperty, getProperties, getProperty } from '../api/propertyApi';
import { useEffect, useState } from 'react';
import { extractApiErrorMessage } from '@/lib/formFeedback';
import { getInsurance } from '@/api/insuranceApi';
import { getPlan } from '@/api/planApi';
import { getRented } from '@/api/rentedApi';
import { getWriting } from '@/api/writingApi';
import { deleteImageByPublicUrl, resolveImageUrl } from '@/lib/imageUpload';
import LoginScreen from './Login';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadSessionAndProperties = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setIsLoggedIn(false);
      setUser(null);
      setProperties([]);
      setIsCheckingAuth(false);
      return;
    }

    setIsLoggedIn(true);
    setUser(JSON.parse(userData));

    getProperties()
      .then((data) => {
        setProperties(data);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  };

  useEffect(() => {
    loadSessionAndProperties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setProperties([]);
  };

  const handleDeleteProperty = async (property: Property) => {
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
        (propertyDetails?.installations || []).forEach((installation: any) => {
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
          .filter((item: any) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: any) => {
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
          .filter((item: any) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: any) => {
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
          .filter((item: any) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: any) => {
            if (item?.contractImage) {
              imageUrls.add(resolveImageUrl(item.contractImage));
            }
          });
      }

      if (writingRes.status === 'fulfilled') {
        const writings = Array.isArray(writingRes.value) ? writingRes.value : [];
        writings
          .filter((item: any) => item?.property?.id === property.id || item?.propertyId === property.id)
          .forEach((item: any) => {
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
    } catch (error: any) {
      alert(`No se pudo eliminar la propiedad: ${extractApiErrorMessage(error)}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={loadSessionAndProperties} />;
  }

  const isAdmin = user?.role === 1;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 md:px-10">
      <section className="mx-auto mb-10 flex w-full max-w-7xl items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-5 shadow-xl">
        <div>
          <p className="text-sm text-slate-400">Bienvenido, {user.name} ({isAdmin ? 'Admin' : 'Viewer'})</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Propiedades</h1>
          <p className="text-sm text-slate-400">Explora las propiedades disponibles</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
        >
          Cerrar Sesión
        </button>
      </section>

      <section className="mx-auto w-full max-w-7xl">
        {isAdmin && (
          <a
            href="/property"
            className="mb-6 inline-flex rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-500"
          >
            Agregar propiedad
          </a>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: Property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="space-y-4 p-5 text-center">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{property.address}</h2>
                  <p className="text-sm text-slate-300">
                    {property.locality}, {property.province}
                  </p>
                  <p className="mt-2 text-slate-200">{property.destiny}</p>

                  <div className="mt-4 flex items-center justify-center">
                    <button
                      className={`rounded-full px-3 py-1 text-sm font-medium focus:outline-none ${
                        property.active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {property.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{property.description}</p>
                </div>

                <div className="mt-4 flex justify-center">
                  <span className="rounded-full border border-sky-400/50 bg-sky-500/20 px-3 py-1 text-sm font-medium text-sky-100">
                    Clasificación: {property.classification.name}
                  </span>
                </div>

                <div className="mt-4 flex flex-col space-y-3">
                  {isAdmin && (
                    <a
                      href={`/property?id=${property.id}`}
                      className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-sky-600"
                    >
                      <span className="material-icons-outlined mr-2">Editar</span>
                    </a>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property)}
                      disabled={deletingId === property.id}
                      className="flex items-center justify-center rounded-lg bg-red-700 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-red-600 disabled:opacity-60"
                    >
                      <span className="material-icons-outlined mr-2">Eliminar Propiedad</span>
                    </button>
                  )}
                  {isAdmin && (
                    <a
                      href={`/document-manager?propertyId=${property.id}`}
                      className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-sky-600"
                    >
                      <span className="material-icons-outlined mr-2">Agregar Documentos</span>
                    </a>
                  )}
                  <a
                    href={`/property/details?id=${property.id}`}
                    className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-sky-600"
                  >
                    <span className="material-icons-outlined mr-2">Ver Detalles</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
