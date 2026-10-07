import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { Complaint, CreateComplaintPayload, UpdateComplaintPayload } from "@/types";

export function getComplaints() {
    return apiClient<ApiResponse<Complaint[]>>("/complaints");
}

export function getComplaintById(id: string) {
    return apiClient<ApiResponse<Complaint>>(`/complaints/${id}`);
}

export function createComplaint(payload: CreateComplaintPayload) {
    return apiClient<ApiResponse<Complaint>>("/complaints", { method: "POST", body: payload });
}

export function updateComplaint(id: string, payload: UpdateComplaintPayload) {
    return apiClient<ApiResponse<Complaint>>(`/complaints/${id}`, { method: "PUT", body: payload });
}

export function deleteComplaint(id: string) {
    return apiClient<ApiResponse<Complaint>>(`/complaints/${id}`, { method: "DELETE" });
}