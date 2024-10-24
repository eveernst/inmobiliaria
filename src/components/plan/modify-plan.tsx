'use client';

import React, { useState, useRef } from 'react';
import Header from "../header";
import { AiOutlineCheckCircle, AiOutlineEdit, AiOutlineCheck, AiOutlineUpload } from 'react-icons/ai';

const ImageModal = ({ imageUrl, onClose, onUpload }: { imageUrl: string; onClose: () => void; onUpload: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-gray-800 p-4 rounded-lg">
        <img src={imageUrl} alt="Imagen de la documentación" className="max-w-full max-h-[80vh]" />
        <div className="flex justify-between mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
            Cerrar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center" onClick={handleUploadClick}>
            <AiOutlineUpload className="mr-2" />
            Cargar Nueva Imagen
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

const EditableField = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 mb-2">
      <label className="w-1/3">{label}:</label>
      {isEditing ? (
        <>
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded-md flex-grow"
          />
          <button onClick={handleSave} className="text-green-500">
            <AiOutlineCheck className="h-5 w-5" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-grow">{value}</span>
          <button onClick={handleEdit} className="text-blue-500">
            <AiOutlineEdit className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default function EditPlan() {
  const [documentType, setDocumentType] = useState<string>('Plano de casa');
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

//   type DocumentData = {
//     [key: string]: any;
//     planoGeneral: { numero: string; año: string; profesional: string; contacto: string; visado: string; fecha: string; };
//     planoEstructura: { estado: boolean; };
//     planoGas: { estado: boolean; };
//     planoAgua: { estado: boolean; };
//     planoLuz: { estado: boolean; };
//     anteproyecto: { estado: boolean; };
//     finalObra: { estado: boolean; };
//     actualizacion: { tipo: string; numero: string; ano: string; profesional: string; contacto: string; visado: string; fecha: string; estado: string; };
//   };

  const [documentData, setDocumentData] = useState({
    planoGeneral: { numero: '001', año: '2023', profesional: 'Juan Pérez', contacto: '123-456-7890', visado: 'VM-2023-001', fecha: '2023-05-15' },
    planoEstructura: { estado: true },
    planoGas: { estado: true },
    planoAgua: { estado: true },
    planoLuz: { estado: true },
    anteproyecto: { estado: true },
    finalObra: { estado: true },
    actualizacion: { tipo: 'General', numero: '002', ano: '2023', profesional: 'María González', contacto: '098-765-4321', visado: 'VM-2023-002', fecha: '2023-06-20', estado: 'Aprobado' }
  });

  const [imageUrls, setImageUrls] = useState({
    general: 'https://url-de-la-base-de-datos/imagen-general.jpg',
    estructura: 'https://url-de-la-base-de-datos/imagen-estructura.jpg',
    gas: 'https://url-de-la-base-de-datos/imagen-gas.jpg',
    agua: 'https://url-de-la-base-de-datos/imagen-agua.jpg',
    luz: 'https://url-de-la-base-de-datos/imagen-luz.jpg',
    anteproyecto: 'https://url-de-la-base-de-datos/imagen-anteproyecto.jpg',
    finalObra: 'https://url-de-la-base-de-datos/imagen-final-obra.jpg',
  });

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setModalImageUrl(null);
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setDocumentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    const currentSection = Object.keys(imageUrls).find(key => imageUrls[key] === modalImageUrl);
    if (currentSection) {
      setImageUrls(prevUrls => ({
        ...prevUrls,
        [currentSection]: imageUrl
      }));
    }
    setModalImageUrl(null);
  };

  const toggleEstado = (section: string) => {
    setDocumentData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        estado: !prevData[section].estado
      }
    }));
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-8">
      <Header />
      
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-4xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Editar Documentación de Plano de Casa</h1>
          {/* <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-48 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md"
          >
            <option value="Plano de casa">Plano de casa</option>
            <option value="Otro tipo">Otro tipo</option>
          </select> */}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Plano General</h2>
          {Object.entries(documentData.planoGeneral).map(([field, value]) => (
            <EditableField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={value}
              onChange={(newValue) => handleInputChange('planoGeneral', field, newValue)}
            />
          ))}
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md mt-2"
            onClick={() => handleImageClick(imageUrls.general)}
          >
            Mostrar Imagen Plano General
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {['planoEstructura', 'planoGas', 'planoAgua', 'planoLuz', 'anteproyecto', 'finalObra'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={() => toggleEstado(item)} className="mr-2">
                  <AiOutlineCheckCircle className={`${documentData[item].estado ? 'text-green-500' : 'text-red-500'} text-xl`} />
                </button>
                <span>{item.replace('plano', 'Plano ').replace('anteproyecto', 'Anteproyecto').replace('finalObra', 'Final de Obra')}</span>
              </div>
              <button
                className="bg-gray-700 text-white px-4 py-1 rounded-md"
                onClick={() => handleImageClick(imageUrls[item.replace('plano', '').toLowerCase()])}
              >
                Imagen
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">ACTUALIZACIÓN</h2>
          {Object.entries(documentData.actualizacion).map(([field, value]) => (
            <EditableField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={value}
              onChange={(newValue) => handleInputChange('actualizacion', field, newValue)}
            />
          ))}
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

      {modalImageUrl && (
        <ImageModal
          imageUrl={modalImageUrl}
          onClose={handleCloseModal}
          onUpload={handleImageUpload}
        />
      )}
    </main>
  );
}