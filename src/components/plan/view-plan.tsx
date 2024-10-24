'use client';

import React, { useState } from 'react';
import Header from "../header";
import { AiOutlineCheckCircle } from 'react-icons/ai';

const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative">
      <img src={imageUrl} alt="Imagen de la documentación" className="max-w-full max-h-screen" />
      <button 
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  </div>
);

export default function ViewPlan() {
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageUrl(null);
  };

  const imageUrls = {
    general: 'https://url-de-la-base-de-datos/imagen-general.jpg',
    estructura: 'https://url-de-la-base-de-datos/imagen-estructura.jpg',
    gas: 'https://url-de-la-base-de-datos/imagen-gas.jpg',
    agua: 'https://url-de-la-base-de-datos/imagen-agua.jpg',
    luz: 'https://url-de-la-base-de-datos/imagen-luz.jpg',
    anteproyecto: 'https://url-de-la-base-de-datos/imagen-anteproyecto.jpg',
    finalObra: 'https://url-de-la-base-de-datos/imagen-final-obra.jpg',
  };

  const documentData = {
    tipo: 'Plano de casa',
    planoGeneral: {
      numero: '001',
      ano: '2023',
      profesional: 'Juan Pérez',
      contacto: '123-456-7890',
      visado: 'VM-2023-001',
      fecha: '2023-05-15'
    },
    planos: [
      { nombre: 'Plano estructura', estado: true },
      { nombre: 'Plano gas', estado: true },
      { nombre: 'Plano agua', estado: true },
      { nombre: 'Plano Luz', estado: false },
      { nombre: 'Anteproyecto', estado: true },
      { nombre: 'Final de Obra', estado: false }
    ],
    actualizacion: {
      tipo: 'General',
      numero: '002',
      ano: '2023',
      profesional: 'María González',
      contacto: '098-765-4321',
      visado: 'VM-2023-002',
      fecha: '2023-06-20',
      estado: 'Aprobado'
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-4xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Documentación de {documentData.tipo}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <AiOutlineCheckCircle className="text-green-500 mr-2 text-xl" />
            <span>Plano General</span>
            <button
              className="ml-auto bg-gray-700 text-white px-4 py-1 rounded-md ml-4"
              onClick={() => handleImageClick(imageUrls.general)}
            >
              Mostrar Imagen
            </button>
          </div>
          <div></div>
          {Object.entries(documentData.planoGeneral).map(([key, value]) => (
            <div key={key} className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md">
              <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {documentData.planos.map((plano, index) => (
            <div key={plano.nombre} className="flex items-center">
              <AiOutlineCheckCircle className={plano.estado ? "text-green-500 mr-2 text-xl" : "text-red-500 mr-2 text-xl"} />
              <span>{plano.nombre}</span>
              <button
                className="ml-auto bg-gray-700 text-white px-4 py-1 rounded-md"
                onClick={() => handleImageClick(Object.values(imageUrls)[index + 1])}
              >
                Imagen
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">ACTUALIZACIÓN</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(documentData.actualizacion).map(([key, value]) => (
              <div key={key} className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md">
                <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
              </div>
            ))}
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-md"
              onClick={() => handleImageClick(imageUrls.finalObra)}
            >
              Ver imagen
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-2 rounded-md">
            Volver
          </button>
        </div>
      </div>

      {modalImageUrl && <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />}
    </main>
  );
}