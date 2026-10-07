export type AIChatRole = "user" | "assistant";

export interface AIChatMessage {
    role: AIChatRole;
    content: string;
}

export interface AIChatPayload {
    messages: AIChatMessage[];
}

export interface AIActor {
    name?: string;
    role?: string;
}

export interface AIStats {
    totalAreas: number;
    areaNames: string[];
    totalUsers: number;
    usersByRole: {
        admin: number;
        operator: number;
        consumer: number;
    };
    totalSchedules: number;
    upcomingSchedules: number;
    complaints: {
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
    };
    payments: {
        total: number;
        pending: number;
        paid: number;
        failed: number;
        collectedAmount: number;
        pendingAmount: number;
    };
    topAreas: { name: string; users: number; schedules: number }[];
}

export interface AIInsightBody {
    summary: string;
    recommendations: string[];
}

export interface AIInsights extends AIInsightBody {
    provider: "gemini" | "local";
    generatedAt: string;
    stats: AIStats;
}

export interface AIChatResponse {
    provider: "gemini" | "local";
    message: AIChatMessage;
}