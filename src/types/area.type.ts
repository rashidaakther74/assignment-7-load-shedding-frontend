export interface Area {
    id: string;
    name: string;
    code: string;
    district: string | null;
    createdAt: string;
    updatedAt: string;
    users?: Array<{ id: string; name: string; email: string }>;
    schedules?: Array<{ id: string; startTime: string; endTime: string; date: string }>;
}

export interface CreateAreaPayload {
    name: string;
    code: string;
    district?: string;
}

export interface UpdateAreaPayload {
    name?: string;
    code?: string;
    district?: string;
}