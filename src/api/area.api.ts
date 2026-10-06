import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { Area, CreateAreaPayload, UpdateAreaPayload } from "@/types";

export function getAreas() {
    return apiClient<ApiResponse<Area[]>>("/areas");
}

export function getAreaById(id: string) {
    return apiClient<ApiResponse<Area>>(`/areas/${id}`);
}

export function createArea(payload: CreateAreaPayload) {
    return apiClient<ApiResponse<Area>>("/areas", { method: "POST", body: payload });
}

export function updateArea(id: string, payload: UpdateAreaPayload) {
    return apiClient<ApiResponse<Area>>(`/areas/${id}`, { method: "PUT", body: payload });
}

export function deleteArea(id: string) {
    return apiClient<ApiResponse<Area>>(`/areas/${id}`, { method: "DELETE" });
}