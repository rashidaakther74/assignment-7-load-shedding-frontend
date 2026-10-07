"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } from "@/api";
import type { CreateSchedulePayload, UpdateSchedulePayload, Schedule } from "@/types";

export function useGetSchedules() {
    return useQuery({
        queryKey: ["schedules"],
        queryFn: getSchedules,
    });
}

export function useGetScheduleById(id: string) {
    return useQuery({
        queryKey: ["schedules", id],
        queryFn: () => getScheduleById(id),
        enabled: !!id,
    });
}

export function useCreateSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSchedulePayload) => createSchedule(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}

export function useUpdateSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) => updateSchedule(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}

export function useDeleteSchedule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}