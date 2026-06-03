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
