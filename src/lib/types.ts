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
  classification?: number;  // omitted when unknown, never sent as null
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
