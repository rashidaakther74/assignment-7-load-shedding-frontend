
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type UserRole = "ADMIN" | "OPERATOR" | "CONSUMER";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
