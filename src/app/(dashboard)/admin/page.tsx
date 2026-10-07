"use client";

import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiInsights } from "@/hook";
import {
    ArrowRight,
    CalendarClock,
    CircleAlert,
    MapPin,
    Receipt,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function AdminOverviewPage() {
    const { data, isPending, isError } = useAiInsights();

    const stats = data?.data.stats;
    const openComplaints = stats
        ? stats.complaints.pending + stats.complaints.inProgress
        : 0;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* page header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Overview
                </h1>
                <p className="text-muted-foreground text-sm">
                    Live status of your load-shedding operations, with AI generated
                    insights.
                </p>
            </div>

            {/* stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {isPending ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="gap-2 py-4">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="size-4" />
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))
                ) : isError || !stats ? (
                    <Card className="sm:col-span-2 xl:col-span-3">
                        <CardContent className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
                            <CircleAlert className="text-destructive size-4" />
                            Stats could not be loaded. Check that the API server is
                            running, then refresh this page.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <StatCard
                            title="Areas"
                            value={stats.totalAreas}
                            icon={MapPin}
                            description={
                                stats.areaNames.length > 0
                                    ? stats.areaNames.slice(0, 3).join(", ")
                                    : "No areas registered yet"
                            }
                        />
                        <StatCard
                            title="Users"
                            value={stats.totalUsers}
                            icon={Users}
                            description={`${stats.usersByRole.admin} admin · ${stats.usersByRole.operator} operator · ${stats.usersByRole.consumer} consumer`}
                        />
                        <StatCard
                            title="Upcoming schedules"
                            value={stats.upcomingSchedules}
                            icon={CalendarClock}
                            badge={
                                stats.upcomingSchedules > 0
                                    ? { label: "Published", variant: "info" }
                                    : { label: "None", variant: "muted" }
                            }
                            description={`${stats.totalSchedules} schedules in total`}
                        />
                        <StatCard
                            title="Open complaints"
                            value={openComplaints}
                            icon={CircleAlert}
                            badge={
                                openComplaints > 0
                                    ? { label: "Action needed", variant: "warning" }
                                    : { label: "All clear", variant: "success" }
                            }
                            description={`${stats.complaints.resolved} of ${stats.complaints.total} resolved`}
                        />
                        <StatCard
                            title="Collected"
                            value={`৳${formatAmount(stats.payments.collectedAmount)}`}
                            icon={Receipt}
                            description={`${stats.payments.paid} paid payments`}
                        />
                        <StatCard
                            title="Outstanding"
                            value={`৳${formatAmount(stats.payments.pendingAmount)}`}
                            icon={TrendingUp}
                            badge={
                                stats.payments.failed > 0
                                    ? {
                                          label: `${stats.payments.failed} failed`,
                                          variant: "destructive",
                                      }
                                    : undefined
                            }
                            description={`${stats.payments.pending} payments pending`}
                        />
                    </>
                )}
            </div>

            {/* AI insights + assistant CTA */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AiInsightsPanel />
                </div>

                <Card className="justify-between gap-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary size-4" />
                            AI Assistant
                        </CardTitle>
                        <CardDescription>
                            Ask about schedules, complaints, payments or areas in plain
                            language — the assistant answers from live data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
                            <li>• &ldquo;When is the next load shedding?&rdquo;</li>
                            <li>• &ldquo;Which complaints are still open?&rdquo;</li>
                            <li>• &ldquo;How much payment is pending?&rdquo;</li>
                        </ul>
                        <Button render={<Link href="/admin/ai" />} className="self-start">
                            Open assistant
                            <ArrowRight />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* quick links */}
            <div className="flex flex-wrap gap-2">
                <Link
                    href="/admin"
                    className="hover:bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors"
                >
                    Overview
                    <ArrowRight className="size-3" />
                </Link>
                <Link
                    href="/admin/ai"
                    className="hover:bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors"
                >
                    AI Assistant
                    <ArrowRight className="size-3" />
                </Link>
            </div>
        </div>
    );
}
