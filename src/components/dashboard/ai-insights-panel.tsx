"use client";

import { useAiInsights } from "@/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Lightbulb, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";

const getErrorMessage = (error: unknown) =>
    (error as { data?: { message?: string } })?.data?.message ||
    (error as { message?: string })?.message ||
    "Could not load AI insights right now";

export function AiInsightsPanel() {
    const { data, isPending, isError, error, refetch, isFetching } = useAiInsights();

    const insights = data?.data;

    return (
        <Card className="gap-4 overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div className="flex flex-col gap-1.5">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        AI Insights
                    </CardTitle>
                    <CardDescription>
                        Auto-generated summary of your live operation data
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {insights ? (
                        <Badge variant={insights.provider === "gemini" ? "info" : "muted"}>
                            {insights.provider === "gemini" ? "Gemini AI" : "Local mode"}
                        </Badge>
                    ) : null}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => refetch()}
                        disabled={isPending || isFetching}
                        aria-label="Refresh AI insights"
                    >
                        {isFetching ? <Spinner /> : <RefreshCw />}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                {isPending ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[92%]" />
                        <Skeleton className="h-4 w-[70%]" />
                        <div className="mt-2 flex flex-col gap-2">
                            <Skeleton className="h-4 w-[85%]" />
                            <Skeleton className="h-4 w-[60%]" />
                        </div>
                    </div>
                ) : isError || !insights ? (
                    <div className="flex flex-col items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
                        <p className="flex items-center gap-2 text-sm text-destructive">
                            <TriangleAlert className="size-4 shrink-0" />
                            {getErrorMessage(error)}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Try again
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm leading-relaxed text-balance">
                            {insights.summary}
                        </p>

                        {insights.recommendations.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
                                    <Lightbulb className="size-3.5" />
                                    Recommendations
                                </p>
                                <ul className="flex flex-col gap-2">
                                    {insights.recommendations.map((item, index) => (
                                        <li
                                            key={`${index}-${item}`}
                                            className="bg-muted/60 flex items-start gap-2 rounded-md px-3 py-2 text-sm"
                                        >
                                            <span className="text-primary mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        <p className="text-muted-foreground text-xs">
                            Generated{" "}
                            {new Date(insights.generatedAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
