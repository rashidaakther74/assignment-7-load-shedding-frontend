"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint,
} from "@/api";
import type { CreateComplaintPayload, UpdateComplaintPayload, Complaint } from "@/types";

export function useGetComplaints() {
    return useQuery({
        queryKey: ["complaints"],
        queryFn: getComplaints,
    });
}

export function useGetComplaintById(id: string) {
    return useQuery({
        queryKey: ["complaints", id],
        queryFn: () => getComplaintById(id),
        enabled: !!id,
    });
}

export function useCreateComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateComplaintPayload) => createComplaint(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
        },
    });
}

export function useUpdateComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateComplaintPayload }) => updateComplaint(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
        },
    });
}

export function useDeleteComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteComplaint(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["complaints"] });
        },
    });
}