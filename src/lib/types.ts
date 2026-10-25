export interface UserData {
  id: number;
  name: string;
  email: string;
  role: number;       // 1=Admin, 2=Viewer, 3=Superusuario
  password?: string;  // solo para crear/editar
}

export const ROLE_OPTIONS = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Usuario" },
  { value: 3, label: "Superusuario" },
] as const;

export const ROLE_LABELS: Record<number, string> = {
  1: "Administrador",
  2: "Usuario",
  3: "Superusuario",
};

export const DOC_TYPES = ["insurance", "rented", "plan", "writing"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  insurance: "Seguro",
  rented: "Alquiler",
  plan: "Plano",
  writing: "Escritura",
};

export const isDocType = (v: unknown): v is DocType => DOC_TYPES.includes(v as DocType);

// Roles are functional, not hierarchical: each permission belongs to exactly one role.
export const canWriteProperties = (role?: number): boolean => role === 1;
export const canManageUsers = (role?: number): boolean => role === 3;

// Body of PUT /property/:id. Only editable fields: the property id goes in the URL.
export interface InstallationUpdatePayload {
  id?: number;              // only for installations that already exist
  name: string;
  quantity: number;
  details: string;
  file: File | string;
}

export interface PropertyUpdatePayload {
  goodUseCode: number;
  description: string;
  classification: number;
  province: string;
  locality: string;
  address: string;
  postalCode: number;
  betweenStreets1: string;
  betweenStreets2: string;
  district: string;
  active: boolean;
  destiny: number;
  clfc: string;
  state: number;
  detailsMaintenance: string;
  file: File | string;
  installations: InstallationUpdatePayload[];
}

// Bodies of PUT /<doc>/:id: only fields the Update*Dto accepts. Never id,
// propertyId, property or timestamps (forbidNonWhitelisted answers 400).
// POST sends the same body plus propertyId. Dates are 'YYYY-MM-DD'.
export interface PlanPayload {
  generalPlan: boolean;
  planNumber: number;
  year: number;
  planImage?: string;
  structurePlan: boolean;
  structureImage?: string;
  gasPlan: boolean;
  gasImage?: string;
  waterPlan: boolean;
  waterImage?: string;
  lightPlan: boolean;
  lightImage?: string;
  projectPlan: boolean;
  projectImage?: string;
  finalPlan: boolean;
  finalImage?: string;
  planType: string;
  planNumberUpdate: number;
  yearUpdate: number;
  stateImage?: string;
  professional: string;
  professionalContact: string;
  dateVisado: string;
  numberVisado: number;
  imageVisado?: string;
  formalities: string;
  documentation: string;
  contacts: string;
}

export interface InsurancePayload {
  name: string;
  phone: string;
  email: string;
  insuredProperty: string;
  insuranceARM: boolean;
  insuranceASE: boolean;
  team: boolean;
  content: boolean;
  values: boolean;
  insuranceImage?: string;
  insuranceDate?: string;
  AnualFormImage?: string;
  AnualFormDate?: string;
  observations: string;
}

export interface RentedPayload {
  ownerDetails: string;
  affectation: string;
  ownerContact: string;
  renterDetails: string;
  address: string;
  renterContact: string;
  locality: string;
  contratStartDate?: string;
  contratEndDate?: string;
  province: string;
  price?: number;
  adjustmentType: string;
  contractImage?: string;
}

export interface WritingPayload {
  writingNumber: number;
  voteNumberJDAAC: number;
  voteDateJDAAC: string;
  imageJDAAC?: string;
  voteNumberJDUA: number;
  voteDateJDUA: string;
  imageJDUA?: string;
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
  ubicationMap?: string;
  cadastralInform?: string;
  actingNotary: string;
  notaryContact: number;
  interiorImage?: string;
  exteriorImage?: string;
  formalities: string;
  documentation: string;
  detailSpaces: string;
}
