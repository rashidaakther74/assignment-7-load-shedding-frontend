import apiClient from "@/lib/apiClient";
import type { AIChatMessage, AIChatResponse, AIInsights } from "@/types/ai.type";
import type { ApiResponse } from "@/types";

export function getAiInsights() {
    return apiClient<ApiResponse<AIInsights>>("/ai/insights");
}

export function sendAiChat(messages: AIChatMessage[]) {
    return apiClient<ApiResponse<AIChatResponse>>("/ai/chat", {
        method: "POST",
        body: { messages },
    });
}
