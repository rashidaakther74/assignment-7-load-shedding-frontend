import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { Schedule, CreateSchedulePayload, UpdateSchedulePayload } from "@/types";

export function getSchedules() {
    return apiClient<ApiResponse<Schedule[]>>("/schedules");
}

export function getScheduleById(id: string) {
    return apiClient<ApiResponse<Schedule>>(`/schedules/${id}`);
}

export function createSchedule(payload: CreateSchedulePayload) {
    return apiClient<ApiResponse<Schedule>>("/schedules", { method: "POST", body: payload });
}

export function updateSchedule(id: string, payload: UpdateSchedulePayload) {
    return apiClient<ApiResponse<Schedule>>(`/schedules/${id}`, { method: "PUT", body: payload });
}

export function deleteSchedule(id: string) {
    return apiClient<ApiResponse<Schedule>>(`/schedules/${id}`, { method: "DELETE" });
}