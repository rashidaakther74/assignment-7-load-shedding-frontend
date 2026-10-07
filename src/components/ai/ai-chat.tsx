"use client";

import { useAiChat } from "@/hook";
import type { AIChatMessage } from "@/types/ai.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ArrowRight, Send, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
    "When is the next load shedding?",
    "How many complaints are still open?",
    "How much payment is still pending?",
    "Which areas are registered?",
];

export default function AiChat() {
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [input, setInput] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);

    const { mutate, isPending, data: chatResponse } = useAiChat();

    const provider = chatResponse?.data.provider;

    useEffect(() => {
        const node = scrollRef.current;
        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    }, [messages, isPending]);

    const handleSend = (content?: string) => {
        const text = (content ?? input).trim();

        if (!text || isPending) {
            return;
        }

        const nextMessages: AIChatMessage[] = [
            ...messages,
            { role: "user", content: text },
        ];

        setMessages(nextMessages);
        setInput("");

        mutate(nextMessages, {
            onSuccess: (response) => {
                setMessages((prev) => [...prev, response.data.message]);
            },
            onError: (error) => {
                const message =
                    (error as { data?: { message?: string } })?.data?.message ||
                    (error as { message?: string })?.message ||
                    "The assistant could not reply, please try again";

                toast.add({
                    title: "AI Assistant",
                    description: message,
                    type: "error",
                });
            },
        });
    };

    return (
        <div className="bg-background flex h-full min-h-0 flex-col rounded-xl border shadow-sm">
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                        <Sparkles className="size-4" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">AI Assistant</span>
                        <span className="text-muted-foreground text-xs">
                            Ask anything about schedules, complaints or payments
                        </span>
                    </div>
                </div>
                <Badge variant={provider === "gemini" ? "info" : "muted"}>
                    {provider === "gemini"
                        ? "Gemini AI"
                        : provider === "local"
                          ? "Local mode"
                          : "Beta"}
                </Badge>
            </div>

            {/* messages */}
            <div
                ref={scrollRef}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                            <Sparkles className="size-6" />
                        </span>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">How can I help you?</p>
                            <p className="text-muted-foreground max-w-sm text-sm">
                                I read the live platform data, so answers are always up to
                                date. Start with one of these:
                            </p>
                        </div>
                        <div className="flex max-w-lg flex-wrap justify-center gap-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => handleSend(suggestion)}
                                    disabled={isPending}
                                    className="hover:bg-muted flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
                                >
                                    {suggestion}
                                    <ArrowRight className="size-3" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`flex flex-col gap-1 ${
                                message.role === "user" ? "items-end" : "items-start"
                            }`}
                        >
                            <span className="text-muted-foreground px-1 text-[0.6875rem]">
                                {message.role === "user" ? "You" : "AI Assistant"}
                            </span>
                            <div
                                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm md:max-w-[70%] ${
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-md"
                                        : "bg-muted rounded-bl-md"
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))
                )}

                {isPending ? (
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-muted-foreground px-1 text-[0.6875rem]">
                            AI Assistant
                        </span>
                        <div className="bg-muted flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                            <Spinner className="size-3.5" />
                            <span className="text-muted-foreground">Thinking…</span>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* composer */}
            <div className="border-t p-3">
                <form
                    className="flex items-end gap-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSend();
                    }}
                >
                    <Textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask about schedules, complaints, payments…"
                        rows={1}
                        className="max-h-32 min-h-10 flex-1 resize-none"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isPending || !input.trim()}
                        aria-label="Send message"
                    >
                        <Send />
                    </Button>
                </form>
                <p className="text-muted-foreground mt-2 flex items-center gap-1 px-1 text-[0.6875rem]">
                    <TriangleAlert className="size-3" />
                    AI answers are generated from live platform data — double check
                    critical decisions. Enter to send, Shift + Enter for a new line.
                </p>
            </div>
        </div>
    );
}
