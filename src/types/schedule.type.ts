export interface Schedule {
    id: string;
    areaId: string;
    area: {
        id: string;
        name: string;
        code: string;
        district: string | null;
    };
    startTime: string;
    endTime: string;
    date: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSchedulePayload {
    zoneId: string;
    startTime: string | Date;
    endTime: string | Date;
    date: string | Date;
    reason?: string;
}

export interface UpdateSchedulePayload {
    zoneId?: string;
    startTime?: string | Date;
    endTime?: string | Date;
    date?: string | Date;
    reason?: string;
}