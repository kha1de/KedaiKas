export type UserRole = "owner" | "manager" | "kasir";

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  manager: "Manager",
  kasir: "Kasir",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  owner: "bg-amber-100 text-amber-800 border-amber-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  kasir: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  id_usaha: number;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserRegisterInput {
  nama: string;
  email: string;
  password: string;
}

export interface UserCreateStaff {
  nama: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateRole {
  role: UserRole;
}
