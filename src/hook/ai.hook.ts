import { getAiInsights, sendAiChat } from "@/api";
import type { AIChatMessage } from "@/types/ai.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAiInsights() {
    return useQuery({
        queryKey: ["ai", "insights"],
        queryFn: getAiInsights,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useAiChat() {
    return useMutation({
        mutationFn: (messages: AIChatMessage[]) => sendAiChat(messages),
    });
}
