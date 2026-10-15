import { toCalendarDate } from '@/lib/calendarDate';
import type { InsurancePayload, PlanPayload, RentedPayload, WritingPayload } from '@/lib/types';

export type FieldKind = 'text' | 'bool' | 'date' | 'image' | 'money' | 'multiline';

export interface FieldConfig<T> {
  key: Extract<keyof T, string>;
  label: string;
  kind: FieldKind;
}

// Labels are the ones used by src/components/documents/*Form.tsx.
export const DOC_FIELDS: {
  insurance: FieldConfig<InsurancePayload>[];
  plan: FieldConfig<PlanPayload>[];
  rented: FieldConfig<RentedPayload>[];
  writing: FieldConfig<WritingPayload>[];
} = {
  insurance: [
    { key: 'name', label: 'Nombre completo', kind: 'text' },
    { key: 'phone', label: 'Teléfono', kind: 'text' },
    { key: 'email', label: 'E-mail', kind: 'text' },
    { key: 'insuredProperty', label: 'Bien asegurado', kind: 'text' },
    { key: 'insuranceARM', label: 'Aseguradora ARM', kind: 'bool' },
    { key: 'insuranceASE', label: 'Aseguradora ART', kind: 'bool' },
    { key: 'team', label: 'Equipo', kind: 'bool' },
    { key: 'content', label: 'Contenido', kind: 'bool' },
    { key: 'values', label: 'Valores', kind: 'bool' },
    { key: 'insuranceDate', label: 'Fecha de póliza', kind: 'date' },
    { key: 'insuranceImage', label: 'Imagen de Póliza', kind: 'image' },
    { key: 'AnualFormDate', label: 'Fecha de formulario anual', kind: 'date' },
    { key: 'AnualFormImage', label: 'Imagen de Formulario Anual', kind: 'image' },
    { key: 'observations', label: 'Observaciones', kind: 'multiline' },
  ],
  plan: [
    { key: 'generalPlan', label: 'Plano General', kind: 'bool' },
    { key: 'planImage', label: 'Imagen Plano General', kind: 'image' },
    { key: 'planNumber', label: 'N° de Plano', kind: 'text' },
    { key: 'year', label: 'Año', kind: 'text' },
    { key: 'professional', label: 'Profesional', kind: 'text' },
    { key: 'professionalContact', label: 'Contacto Profesional', kind: 'text' },
    { key: 'structurePlan', label: 'Plano Estructura', kind: 'bool' },
    { key: 'structureImage', label: 'Imagen Plano Estructura', kind: 'image' },
    { key: 'gasPlan', label: 'Plano Gas', kind: 'bool' },
    { key: 'gasImage', label: 'Imagen Plano Gas', kind: 'image' },
    { key: 'waterPlan', label: 'Plano Agua', kind: 'bool' },
    { key: 'waterImage', label: 'Imagen Plano Agua', kind: 'image' },
    { key: 'lightPlan', label: 'Plano Luz', kind: 'bool' },
    { key: 'lightImage', label: 'Imagen Plano Luz', kind: 'image' },
    { key: 'projectPlan', label: 'Anteproyecto', kind: 'bool' },
    { key: 'projectImage', label: 'Imagen Anteproyecto', kind: 'image' },
    { key: 'finalPlan', label: 'Final de Obra', kind: 'bool' },
    { key: 'finalImage', label: 'Imagen Final de Obra', kind: 'image' },
    { key: 'planType', label: 'Tipo de Plano', kind: 'text' },
    { key: 'planNumberUpdate', label: 'N° de Plano (actualización)', kind: 'text' },
    { key: 'yearUpdate', label: 'Año (actualización)', kind: 'text' },
    { key: 'numberVisado', label: 'Visado Municipal', kind: 'text' },
    { key: 'dateVisado', label: 'Fecha Visado', kind: 'date' },
    { key: 'imageVisado', label: 'Imagen Visado', kind: 'image' },
    { key: 'stateImage', label: 'Imagen Estado', kind: 'image' },
    { key: 'formalities', label: 'Formalidades', kind: 'multiline' },
    { key: 'documentation', label: 'Documentación', kind: 'multiline' },
    { key: 'contacts', label: 'Contactos', kind: 'multiline' },
  ],
  rented: [
    { key: 'ownerDetails', label: 'Datos del propietario', kind: 'text' },
    { key: 'ownerContact', label: 'Contacto del propietario', kind: 'text' },
    { key: 'renterDetails', label: 'Datos del inquilino', kind: 'text' },
    { key: 'renterContact', label: 'Contacto del inquilino', kind: 'text' },
    { key: 'affectation', label: 'Afectación', kind: 'text' },
    { key: 'address', label: 'Dirección', kind: 'text' },
    { key: 'locality', label: 'Localidad', kind: 'text' },
    { key: 'province', label: 'Provincia', kind: 'text' },
    { key: 'contratStartDate', label: 'Fecha de comienzo', kind: 'date' },
    { key: 'contratEndDate', label: 'Fecha de finalización', kind: 'date' },
    { key: 'price', label: 'Monto ($)', kind: 'money' },
    { key: 'adjustmentType', label: 'Tipo de ajuste', kind: 'text' },
    { key: 'contractImage', label: 'Imagen de Contrato', kind: 'image' },
  ],
  writing: [
    { key: 'writingNumber', label: 'Número de escritura', kind: 'text' },
    { key: 'voteNumberJDAAC', label: 'Voto JD AAC', kind: 'text' },
    { key: 'voteDateJDAAC', label: 'Fecha de JD AAC', kind: 'date' },
    { key: 'imageJDAAC', label: 'Imagen JD AAC', kind: 'image' },
    { key: 'voteNumberJDUA', label: 'Voto JD UA', kind: 'text' },
    { key: 'voteDateJDUA', label: 'Fecha de JD UA', kind: 'date' },
    { key: 'imageJDUA', label: 'Imagen JD UA', kind: 'image' },
    { key: 'domain', label: 'Dominio', kind: 'text' },
    { key: 'folio', label: 'Folio', kind: 'text' },
    { key: 'tomo', label: 'Tomo', kind: 'text' },
    { key: 'year', label: 'Año', kind: 'text' },
    { key: 'department', label: 'Departamento', kind: 'text' },
    { key: 'totalSurface', label: 'Superficie Total', kind: 'text' },
    { key: 'coveredSurface', label: 'Superficie Cubierta', kind: 'text' },
    { key: 'improvementSurface', label: 'Superficie Mejoras', kind: 'text' },
    { key: 'improvementValue', label: 'Valor Mejoras ($)', kind: 'money' },
    { key: 'cadastralNomenclature', label: 'Nomenclatura Catastral', kind: 'text' },
    { key: 'ubicationMap', label: 'Ubicación en Mapa', kind: 'text' },
    { key: 'cadastralInform', label: 'Informe Catastral', kind: 'text' },
    { key: 'interiorImage', label: 'Imagen Interior', kind: 'image' },
    { key: 'exteriorImage', label: 'Imagen Exterior', kind: 'image' },
    { key: 'actingNotary', label: 'Escribano Actuante', kind: 'text' },
    { key: 'notaryContact', label: 'Contacto Escribano', kind: 'text' },
    { key: 'formalities', label: 'Trámites', kind: 'multiline' },
    { key: 'documentation', label: 'Documentación', kind: 'multiline' },
    { key: 'detailSpaces', label: 'Detalles Espacios', kind: 'multiline' },
  ],
};

const EMPTY = '—';
const moneyFormat = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

// Text shown for a stored value. `false` is a real value ("No"), not an empty one.
export const formatFieldValue = (value: unknown, kind: Exclude<FieldKind, 'image'>): string => {
  if (value === null || value === undefined || value === '') return EMPTY;
  switch (kind) {
    case 'bool':
      return value ? 'Sí' : 'No';
    case 'date': {
      // Split the string instead of using new Date() to avoid the UTC-3 day shift.
      const calendar = toCalendarDate(value);
      if (!calendar) return EMPTY;
      const [year, month, day] = calendar.split('-');
      return `${day}/${month}/${year}`;
    }
    case 'money': {
      const amount = Number(value);
      return Number.isFinite(amount) ? moneyFormat.format(amount) : EMPTY;
    }
    default:
      return String(value);
  }
};
