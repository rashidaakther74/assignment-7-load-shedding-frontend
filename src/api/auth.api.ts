import apiClient from "@/lib/apiClient";
import { LoginPayload, RegisterPayload } from "@/types";

export function userRegistration(payload: RegisterPayload) {
    return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogin(payload: LoginPayload) {
    return apiClient("/auth/login", { method: "POST", body: payload });
}