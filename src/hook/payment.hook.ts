"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayments, getMyPayments, createCheckoutSession, createPaymentRecord } from "@/api";
import type { CreateCheckoutSessionPayload, CreatePaymentRecordPayload } from "@/types";

export function useGetPayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: getPayments,
    });
}

export function useGetMyPayments() {
    return useQuery({
        queryKey: ["my-payments"],
        queryFn: getMyPayments,
    });
}

export function useCreateCheckoutSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCheckoutSessionPayload) => createCheckoutSession(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["my-payments"] });
        },
    });
}

export function useCreatePaymentRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePaymentRecordPayload) => createPaymentRecord(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["my-payments"] });
        },
    });
}