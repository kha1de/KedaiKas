export interface User {
  id: number;
  nama: string;
  email: string;
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
