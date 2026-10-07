"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAIInsights, chatWithAI } from "@/api";
import type { AIInsights, AIChatPayload, AIChatResponse, AIChatMessage } from "@/types";

export function useAIInsights() {
    return useQuery<AIInsights>({
        queryKey: ["ai-insights"],
        queryFn: async () => {
            const response = await getAIInsights();
            return response.data;
        },
    });
}

export function useAIChat() {
    return useMutation<AIChatResponse, Error, AIChatPayload>({
        mutationFn: async (payload) => {
            const response = await chatWithAI(payload);
            return response.data;
        },
    });
}

// Alias for backward compatibility with existing ai-chat component
export const useAiChat = useAIChat;
export const useAiInsights = useAIInsights;

// Helper hook for managing chat state
import { useState, useCallback } from "react";

export function useChatHistory() {
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatMutation = useAIChat();

    const sendMessage = useCallback(
        async (content: string) => {
            const userMessage: AIChatMessage = { role: "user", content };
            const newMessages = [...messages, userMessage];

            setMessages(newMessages);
            setIsLoading(true);

            try {
                const response = await chatMutation.mutateAsync({
                    messages: newMessages,
                });

                const assistantMessage = response.message;
                setMessages((prev) => [...prev, assistantMessage]);
            } catch (error) {
                const errorMessage: AIChatMessage = {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages, chatMutation]
    );

    const clearHistory = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        isLoading: isLoading || chatMutation.isPending,
        sendMessage,
        clearHistory,
    };
}