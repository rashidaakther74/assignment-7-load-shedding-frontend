export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    trxId: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateCheckoutSessionPayload {
    amount: number;
}

export interface CreateCheckoutSessionResponse {
    url: string;
    sessionId: string;
}

export interface CreatePaymentRecordPayload {
    amount: number;
    trxId: string;
}

export interface CreatePaymentRecordResponse {
    id: string;
    userId: string;
    amount: number;
    trxId: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}