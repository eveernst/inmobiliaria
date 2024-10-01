"use client";

import React, { useState } from 'react';
import Header from "../../../components/header";
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Icono visual

// Modal de imagen
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

export default function NewDocumentation() {
  const [documentType, setDocumentType] = useState<string>('Plano de casa');
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null); // Estado para controlar la URL de la imagen que se muestra en el modal

  // Función para abrir el modal con la URL de la imagen
  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalImageUrl(null);
  };

  // Ejemplo de URLs de las imágenes sacadas de la base de datos
  const imageUrls = {
    general: 'https://url-de-la-base-de-datos/imagen-general.jpg',
    estructura: 'https://url-de-la-base-de-datos/imagen-estructura.jpg',
    gas: 'https://url-de-la-base-de-datos/imagen-gas.jpg',
    agua: 'https://url-de-la-base-de-datos/imagen-agua.jpg',
    luz: 'https://url-de-la-base-de-datos/imagen-luz.jpg',
    anteproyecto: 'https://url-de-la-base-de-datos/imagen-anteproyecto.jpg',
    finalObra: 'https://url-de-la-base-de-datos/imagen-final-obra.jpg',
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-4xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Nueva Documentación de Plano de Casa</h1>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-48 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="Plano de casa">Plano de casa</option>
            <option value="Otro tipo">Otro tipo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <AiOutlineCheckCircle className="text-green-500 mr-2 text-xl" /> {/* Icono visual */}
            <label htmlFor="planoGeneral">Plano General</label>
            <button
              className="ml-auto bg-gray-700 text-white px-4 py-1 rounded-md ml-4"
              onClick={() => handleImageClick(imageUrls.general)}
            >
              Mostrar Imagen
            </button>
          </div>
          <div></div>
          <input placeholder="N° de Plano" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Año" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Contacto del profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Visado Municipal" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
          <input placeholder="Fecha" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['Plano estructura', 'Plano gas', 'Plano agua', 'Plano Luz', 'Anteproyecto', 'Final de Obra'].map((item, index) => (
            <div key={item} className="flex items-center">
              <AiOutlineCheckCircle className="text-green-500 mr-2 text-xl" /> {/* Icono visual */}
              <label htmlFor={item}>{item}</label>
              <button
                className="ml-auto bg-gray-700 text-white px-4 py-1 rounded-md"
                onClick={() => handleImageClick(Object.values(imageUrls)[index + 1])} // Cambiar URL según el item
              >
                Imagen
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">ACTUALIZACIÓN</h2>
          <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <AiOutlineCheckCircle className="text-green-500 mr-2 text-xl" /> {/* Icono visual */}
            <label >Tipo de Plano</label>
           
          </div>
            <select  className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md">
              <option value="tipo1">General</option>
              <option value="tipo2">Electricidad</option>
              <option value="tipo1">Agua</option>
              <option value="tipo2">Gas</option>
            </select>
            <input placeholder="N° de Plano" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Año" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Contacto del profesional" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md col-span-2" />
            <input placeholder="Visado Municipal" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="Fecha" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <input placeholder="N°" className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md" />
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
              ESTADO
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-md"
              onClick={() => handleImageClick(imageUrls.finalObra)}
            >
              Ver imagen
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-2 rounded-md">
            Cancelar
          </button>
          <button className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-2 rounded-md">
            Aceptar
          </button>
        </div>
      </div>

      {/* Modal para mostrar la imagen en grande */}
      {modalImageUrl && <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />}
    </main>
  );
}
