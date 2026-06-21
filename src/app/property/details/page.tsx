'use client';

import { getProperty } from '@/api/propertyApi';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Installation {
  id: number;
  name: string;
  quantity: number;
  file: string | null;
  details: string;
  classification: {
    name: string;
    id: number;
  };
}

interface Writing {
  id: number;
  writingNumber: number;
  voteNumberJDAAC: number;
  voteDateJDAAC: string;
  imageJDAAC: string;
  voteNumberJDUA: number;
  voteDateJDUA: string;
  imageJDUA: string;
  domain: string;
  folio: string;
  tomo: string;
  year: number;
  department: string;
  totalSurface: number;
  coveredSurface: number;
  improvementSurface: number;
  improvementValue: number;
  cadastralNomenclature: string;
  ubicationMap: string;
  cadastralInform: string;
  actingNotary: string;
  notaryContact: number;
  interiorImage: string;
  exteriorImage: string;
  formalities: string;
  documentation: string;
  detailSpaces: string;
}

interface Insurance {
  id: number;
  name: string;
  phone: number;
  email: string;
  insuredProperty: string;
  insuranceARM: boolean;
  insuranceASE: boolean;
  team: boolean;
  content: boolean;
  values: boolean;
  insuranceLink?: string;
  insuranceImage?: string;
  insuranceDate?: string;
  AnualFormLink?: string;
  AnualFormImage?: string;
  AnualFormDate?: string;
  observations: string;
}

interface Plan {
  id: number;
  generalPlan: boolean;
  planNumber: number;
  year: number;
  planImage: string;
  profesional: string;
  professionalContact: string;
  numberVisado: number;
  dateVisado: string;
  structurePlan: boolean;
  structureImage: string;
  gasPlan: boolean;
  gasImage: string;
  waterPlan: boolean;
  waterImage: string;
  lightPlan: boolean;
  lightImage: string;
  projectPlan: boolean;
  projectImage: string;
  finalPlan: boolean;
  finalImage: string;
  planType: string;
  planNumberUpdate: number;
  yearUpdate: string;
  stateImage: string;
  imageVisado: string;
  formalities: string;
  documentation: string;
  contacts: string;
}

interface Rented {
  id: number;
  ownerDetails: string;
  affectation: string;
  ownerContact: string;
  renterDetails: string;
  address: string;
  renterContact: string;
  locality: string;
  contratStartDate: string;
  contratEndDate: string;
  province: string;
  price: number;
  adjustmentType: string;
  contractImage: string;
}
interface Property {
  id: number;
  goodUseCode: number;
  file: string | null;
  province: string;
  locality: string;
  address: string;
  postalCode: number;
  betweenStreets1: string;
  betweenStreets2: string;
  district: string;
  destiny: string;
  state: number;
  active: boolean;
  clfc: string;
  detailsMaintenance: string;
  description: string;
  classification: {
    name: string;
    id: number;
  };
  installations: Installation[];
  writings: Writing[];
  insurances: Insurance[];
  plans: Plan[];
  renteds: Rented[];
}

const PropertyView: React.FC = () => {
  const [property, setProperty] = useState<Property>({
    id: 0,
    goodUseCode: 0,
    file: null,
    province: '',
    locality: '',
    address: '',
    postalCode: 0,
    betweenStreets1: '',
    betweenStreets2: '',
    district: '',
    destiny: '',
    state: 0,
    active: false,
    clfc: '',
    detailsMaintenance: '',
    description: '',
    classification: {
      name: '',
      id: 0,
    },
    installations: [],
    writings: [],
    insurances: [],
    plans: [],
    renteds: [],
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get('id'));
    async function fetchProperty(id: number) {
      getProperty(id).then((data) => {
        setProperty(data);
        console.log(data);
      });
    }
    fetchProperty(id);
  }, []);
  // useEffect(() => {
  //   const query = new URLSearchParams(window.location.search);
  //   const id = Number(query.get('id'));
  
  //   if (!id) return;
  
  //   const fetchProperty = async () => {
  //     const data = await getProperty(id);
  //     console.log("Datos de la propiedad:", data); // Verifica writings, renteds, plans, insurances
  //     setProperty(data);
  //   };
  
  //   fetchProperty();
  // }, []);

  if (!property) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Detalles de la Propiedad</h1>

        {/* Datos Generales */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Información General</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {property.id}</p>
            <p><strong>Código de Buen Uso:</strong> {property.goodUseCode}</p>
            <p><strong>Provincia:</strong> {property.province}</p>
            <p><strong>Localidad:</strong> {property.locality}</p>
            <p><strong>Dirección:</strong> {property.address}</p>
            <p><strong>Código Postal:</strong> {property.postalCode}</p>
            <p><strong>Entre calles:</strong> {property.betweenStreets1} y {property.betweenStreets2}</p>
            <p><strong>Barrio:</strong> {property.district}</p>
            <p><strong>Destino:</strong> {property.destiny}</p>
            <p><strong>Estado:</strong> {property.state ? 'Activo' : 'Inactivo'}</p>
            <p><strong>Mantenimiento:</strong> {property.detailsMaintenance}</p>
            <p><strong>Descripción:</strong> {property.description}</p>
          </div>
        </section>

        {/* Clasificación */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Clasificación</h2>
          {property.classification ? (
            <div>
              <p><strong>Nombre:</strong> {property.classification.name}</p>
              <p><strong>ID:</strong> {property.classification.id}</p>
            </div>
          ) : (
            <p>No hay clasificación registrada.</p>
          )}
        </section>

        {/* Instalaciones */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Instalaciones</h2>
          {property.installations.length > 0 ? (
            <ul className="space-y-4">
              {property.installations.map((installation) => (
                <li
                  key={installation.id}
                  className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                >
                  <p><strong>Nombre:</strong> {installation.name}</p>
                  <p><strong>Cantidad:</strong> {installation.quantity}</p>
                  <p><strong>Detalles:</strong> {installation.details}</p>
                  <p>
                    <strong>Clasificación:</strong> {installation.classification.name} (ID: {installation.classification.id})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay instalaciones registradas.</p>
          )}
        </section>

        {/* Documentacion */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Documentación</h2>
          <Accordion type="single" collapsible className="w-full">
            {property.writings && property.writings.length > 0 ? (
              <ul className="space-y-4">
                {property.writings.map((writing) => (
                  <AccordionItem value={`writing-${writing.id}`}>
                    <AccordionTrigger>Escritura</AccordionTrigger>
                    <AccordionContent>
                      <li
                        key={writing.id}
                        className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                      >

                        <p><strong>Numero de escritura:</strong> {writing.writingNumber}</p>
                        <p><strong>Numero de voto JDAAC:</strong> {writing.voteNumberJDAAC}</p>
                        <p><strong>Fecha de voto JDAAC:</strong> {writing.voteDateJDAAC}</p>
                        <p><strong>Imagen JDAAC:</strong> {writing.imageJDAAC}</p>
                        <p><strong>Numero de voto JDUA:</strong> {writing.voteNumberJDUA}</p>
                        <p><strong>Fecha de voto JDUA:</strong> {writing.voteDateJDUA}</p>
                        <p><strong>Imagen JDUA:</strong> {writing.imageJDUA}</p>
                        <p><strong>Dominio:</strong> {writing.domain}</p>
                        <p><strong>Folio:</strong> {writing.folio}</p>
                        <p><strong>Tomo:</strong> {writing.tomo}</p>
                        <p><strong>Año:</strong> {writing.year}</p>
                        <p><strong>Departamento:</strong> {writing.department}</p>
                        <p><strong>Superficie total:</strong> {writing.totalSurface}</p>
                        <p><strong>Superficie cubierta:</strong> {writing.coveredSurface}</p>
                        <p><strong>Superficie de mejora:</strong> {writing.improvementSurface}</p>
                        <p><strong>Valor de mejora:</strong> {writing.improvementValue}</p>
                        <p><strong>Nomenclatura catastral:</strong> {writing.cadastralNomenclature}</p>
                        <p><strong>Ubicación en el mapa:</strong> {writing.ubicationMap}</p>
                        <p><strong>Información catastral:</strong> {writing.cadastralInform}</p>
                        <p><strong>Notario actuante:</strong> {writing.actingNotary}</p>
                        <p><strong>Contacto del notario:</strong> {writing.notaryContact}</p>
                        <p><strong>Imagen interior:</strong> {writing.interiorImage}</p>
                        <p><strong>Imagen exterior:</strong> {writing.exteriorImage}</p>
                        <p><strong>Tramites:</strong> {writing.formalities}</p>
                        <p><strong>Documentación:</strong> {writing.documentation}</p>
                        <p><strong>Detalle de espacios:</strong> {writing.detailSpaces}</p>
                      </li>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </ul>
            ) : (
              <p>No hay escrituras registradas.</p>
            )}

            {property.insurances && property.insurances.length > 0 ? (
              <ul className="space-y-4">
                {property.insurances.map((insurance) => (
                  <li
                    key={insurance.id}
                    className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                  >
                    <AccordionItem value={`insurance-${insurance.id}`}>
                      <AccordionTrigger>Seguro</AccordionTrigger>
                      <AccordionContent>
                        <p><strong>Nombre:</strong> {insurance.name}</p>
                        <p><strong>Teléfono:</strong> {insurance.phone}</p>
                        <p><strong>Email:</strong> {insurance.email}</p>
                        <p><strong>Propiedad asegurada:</strong> {insurance.insuredProperty}</p>
                        <p><strong>Seguro ARM:</strong> {insurance.insuranceARM ? 'Si' : 'No'}</p>
                        <p><strong>Seguro ASE:</strong> {insurance.insuranceASE ? 'Si' : 'No'}</p>
                        <p><strong>Equipo:</strong> {insurance.team ? 'Si' : 'No'}</p>
                        <p><strong>Contenido:</strong> {insurance.content ? 'Si' : 'No'}</p>
                        <p><strong>Valores:</strong> {insurance.values ? 'Si' : 'No'}</p>
                        <p><strong>Link del seguro:</strong> {insurance.insuranceLink}</p>
                        <p><strong>Imagen del seguro:</strong> {insurance.insuranceImage}</p>
                        <p><strong>Fecha del seguro:</strong> {insurance.insuranceDate}</p>
                        <p><strong>Link del formulario anual:</strong> {insurance.AnualFormLink}</p>
                        <p><strong>Imagen del formulario anual:</strong> {insurance.AnualFormImage}</p>
                        <p><strong>Fecha del formulario anual:</strong> {insurance.AnualFormDate}</p>
                        <p><strong>Observaciones:</strong> {insurance.observations}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay seguros registrados.</p>
            )}

            {property.plans && property.plans.length > 0 ? (
              <ul className="space-y-4">
                {property.plans.map((plan) => (
                  <li
                    key={plan.id}
                    className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                  >
                    <AccordionItem value={`plan-${plan.id}`}>
                      <AccordionTrigger>Plano de casa</AccordionTrigger>
                      <AccordionContent>
                        <p><strong>Plano general:</strong> {plan.generalPlan ? 'Si' : 'No'}</p>
                        <p><strong>Numero de plano:</strong> {plan.planNumber}</p>
                        <p><strong>Año:</strong> {plan.year}</p>
                        <p><strong>Imagen del plano:</strong> {plan.planImage}</p>
                        <p><strong>Profesional:</strong> {plan.profesional}</p>
                        <p><strong>Contacto profesional:</strong> {plan.professionalContact}</p>
                        <p><strong>Numero de visado:</strong> {plan.numberVisado}</p>
                        <p><strong>Fecha de visado:</strong> {plan.dateVisado}</p>
                        <p><strong>Plano de estructura:</strong> {plan.structurePlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen de la estructura:</strong> {plan.structureImage}</p>
                        <p><strong>Plano de gas:</strong> {plan.gasPlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen del gas:</strong> {plan.gasImage}</p>
                        <p><strong>Plano de agua:</strong> {plan.waterPlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen del agua:</strong> {plan.waterImage}</p>
                        <p><strong>Plano de luz:</strong> {plan.lightPlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen de la luz:</strong> {plan.lightImage}</p>
                        <p><strong>Plano de proyecto:</strong> {plan.projectPlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen del proyecto:</strong> {plan.projectImage}</p>
                        <p><strong>Plano final:</strong> {plan.finalPlan ? 'Si' : 'No'}</p>
                        <p><strong>Imagen del plano final:</strong> {plan.finalImage}</p>
                        <p><strong>Tipo de plano:</strong> {plan.planType}</p>
                        <p><strong>Numero de plano actualizado:</strong> {plan.planNumberUpdate}</p>
                        <p><strong>Año actualizado:</strong> {plan.yearUpdate}</p>
                        <p><strong>Imagen del estado:</strong> {plan.stateImage}</p>
                        <p><strong>Imagen del visado:</strong> {plan.imageVisado}</p>
                        <p><strong>Tramites:</strong> {plan.formalities}</p>
                        <p><strong>Documentación:</strong> {plan.documentation}</p>
                        <p><strong>Contactos:</strong> {plan.contacts}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay planos registrados.</p>
            )}

            {property.renteds && property.renteds.length > 0 ? (
              <ul className="space-y-4">
                {property.renteds.map((rented) => (
                  <li
                    key={rented.id}
                    className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm"
                  >
                    <AccordionItem value={`rented-${rented.id}`}>
                      <AccordionTrigger>Alquilado</AccordionTrigger>
                      <AccordionContent>
                        <p><strong>Detalles del propietario:</strong> {rented.ownerDetails}</p>
                        <p><strong>Afectación:</strong> {rented.affectation}</p>
                        <p><strong>Contacto del propietario:</strong> {rented.ownerContact}</p>
                        <p><strong>Detalles del inquilino:</strong> {rented.renterDetails}</p>
                        <p><strong>Dirección:</strong> {rented.address}</p>
                        <p><strong>Contacto del inquilino:</strong> {rented.renterContact}</p>
                        <p><strong>Localidad:</strong> {rented.locality}</p>
                        <p><strong>Fecha de inicio del contrato:</strong> {rented.contratStartDate}</p>
                        <p><strong>Fecha de fin del contrato:</strong> {rented.contratEndDate}</p>
                        <p><strong>Provincia:</strong> {rented.province}</p>
                        <p><strong>Precio:</strong> {rented.price}</p>
                        <p><strong>Tipo de ajuste:</strong> {rented.adjustmentType}</p>
                        <p><strong>Imagen del contrato:</strong> {rented.contractImage}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay inmuebles alquilados.</p>
            )}
          </Accordion>
          {/* <a
            href={`/property/documentation?id=${property.id}`}
            className="flex items-center justify-center bg-slate-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
          </a> */}
        </section>
      </div>
    </div>
  );
};

export default PropertyView;
