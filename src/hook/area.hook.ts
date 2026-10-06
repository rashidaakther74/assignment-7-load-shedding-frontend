"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAreas,
    getAreaById,
    createArea,
    updateArea,
    deleteArea,
} from "@/api";
import type { CreateAreaPayload, UpdateAreaPayload, Area } from "@/types";

export function useGetAreas() {
    return useQuery({
        queryKey: ["areas"],
        queryFn: getAreas,
    });
}

export function useGetAreaById(id: string) {
    return useQuery({
        queryKey: ["areas", id],
        queryFn: () => getAreaById(id),
        enabled: !!id,
    });
}

export function useCreateArea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAreaPayload) => createArea(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });
}

export function useUpdateArea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateAreaPayload }) => updateArea(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });
}

export function useDeleteArea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteArea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });
}