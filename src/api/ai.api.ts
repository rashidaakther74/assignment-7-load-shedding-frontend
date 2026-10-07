import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { AIInsights, AIChatPayload, AIChatResponse } from "@/types";

export function getAIInsights() {
    return apiClient<ApiResponse<AIInsights>>("/ai/insights");
}

export function chatWithAI(payload: AIChatPayload) {
    return apiClient<ApiResponse<AIChatResponse>>("/ai/chat", {
        method: "POST",
        body: payload,
    });
}