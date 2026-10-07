export type AIChatRole = "user" | "assistant";

export interface AIChatMessage {
    role: AIChatRole;
    content: string;
}

export type AIProvider = "gemini" | "local";

export interface AIChatResponse {
    provider: AIProvider;
    message: AIChatMessage;
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

export interface AIInsights {
    provider: AIProvider;
    generatedAt: string;
    summary: string;
    recommendations: string[];
    stats: AIStats;
}
