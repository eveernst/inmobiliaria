'use client';

import { deleteProperty, getProperties, getProperty } from '../api/propertyApi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractApiErrorMessage } from '@/lib/formFeedback';
import { getInsurance } from '@/api/insuranceApi';
import { getPlan } from '@/api/planApi';
import { getRented } from '@/api/rentedApi';
import { getWriting } from '@/api/writingApi';
import { deleteImageByPublicUrl, resolveImageUrl } from '@/lib/imageUpload';
// import Navbar from './Navbar';

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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // router.push('/login');
      setUser(null);
      return;
    }

    setUser(JSON.parse(userData));

    getProperties().then((data) => {
      console.log(data);
      setProperties(data);
    });
  }, [router]);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   router.push('/login');
  // };

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

  if (!user) {
    return null; // Loading state
  }

  const isAdmin = user.role === 1;

  return (
    // <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] text-gray-200">
    //   <Navbar onLogout={handleLogout} />
    //   <div className='p-6 md:p-8'>
    <div className="min-h-screen w-full text-gray-200">
      <div className='w-full p-6 md:p-8'>
        <header className="mb-10 rounded-3xl border-[0.5px] border-slate-700/70 bg-slate-900/45 px-6 py-6 shadow-2xl backdrop-blur-sm">
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              Bienvenido, {user.name} ({isAdmin ? 'Admin' : 'Viewer'})
            </p>
          </div>

      <h1 className="text-center text-4xl font-bold tracking-tight text-slate-100 mb-2">Propiedades</h1>
          <p className="text-center text-slate-300">Explora las propiedades disponibles</p>
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="group overflow-hidden rounded-2xl border-[0.5px] border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="space-y-4 p-5 text-center">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-100">{property.address}</h2>
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
                <span className="rounded-full border-[0.5px] border-sky-400/50 bg-sky-500/25 px-3 py-1 text-sm font-medium text-sky-100">
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
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProperty(property)}
                    disabled={deletingId === property.id}
                    className="flex items-center justify-center bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                  >
                    <span className="material-icons-outlined mr-2">Eliminar Propiedad</span>
                  </button>
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
    </div>
  );
};

export default Home;
