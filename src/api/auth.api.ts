import apiClient from "@/lib/apiClient";
import type { ApiResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types";

export function userRegistration(payload: RegisterPayload) {
    return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogin(payload: LoginPayload) {
    return apiClient("/auth/login", { method: "POST", body: payload });
}

export function getMe() {
    return apiClient<ApiResponse<AuthUser>>("/auth/me");
}

export function logout() {
    return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}
