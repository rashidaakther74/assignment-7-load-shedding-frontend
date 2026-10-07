import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { Payment, CreateCheckoutSessionPayload, CreateCheckoutSessionResponse, CreatePaymentRecordPayload } from "@/types";

export function getPayments() {
    return apiClient<ApiResponse<Payment[]>>("/payments");
}

export function getMyPayments() {
    return apiClient<ApiResponse<Payment[]>>("/payments/my-payments");
}

export function createCheckoutSession(payload: CreateCheckoutSessionPayload) {
    return apiClient<ApiResponse<CreateCheckoutSessionResponse>>("/payments/create-checkout-session", {
        method: "POST",
        body: payload,
    });
}

export function createPaymentRecord(payload: CreatePaymentRecordPayload) {
    return apiClient<ApiResponse<Payment>>("/payments", { method: "POST", body: payload });
}