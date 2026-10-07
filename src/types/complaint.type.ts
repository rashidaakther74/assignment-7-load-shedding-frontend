export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export interface Complaint {
    id: string;
    userId: string;
    subject: string;
    description: string;
    status: ComplaintStatus;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateComplaintPayload {
    subject: string;
    description: string;
}

export interface UpdateComplaintPayload {
    status?: ComplaintStatus;
}