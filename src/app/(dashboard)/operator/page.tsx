"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, CalendarClock, CircleAlert, Receipt, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAiInsights } from "@/hook";
import { useGetSchedules } from "@/hook";

export default function OperatorOverviewPage() {
    const { data: insights, isPending, isError } = useAiInsights();
    const { data: schedulesResponse, isLoading: isLoadingSchedules } = useGetSchedules();

    const stats = insights?.stats;
    const schedules: any[] = schedulesResponse?.data || [];
    const parseDateStr = (dateStr: string) => {
        const [year, month, day] = dateStr?.split("-") || ["0000", "01", "01"];
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };
    const upcomingSchedules = schedules.filter((s) => parseDateStr(s.date) >= new Date()).length;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Operator Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage schedules and handle complaints.
                </p>
            </div>

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
                            Stats could not be loaded. Check that the API server is running.
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
                            value={upcomingSchedules}
                            icon={CalendarClock}
                            badge={
                                upcomingSchedules > 0
                                    ? { label: "Published", variant: "info" }
                                    : { label: "None", variant: "muted" }
                            }
                            description={`${schedules.length} schedules in total`}
                        />
                        <StatCard
                            title="Open complaints"
                            value={stats.complaints.pending + stats.complaints.inProgress}
                            icon={CircleAlert}
                            badge={
                                stats.complaints.pending + stats.complaints.inProgress > 0
                                    ? { label: "Action needed", variant: "warning" }
                                    : { label: "All clear", variant: "success" }
                            }
                            description={`${stats.complaints.resolved} of ${stats.complaints.total} resolved`}
                        />
                        <StatCard
                            title="Collected"
                            value={`৳${stats.payments.collectedAmount.toLocaleString()}`}
                            icon={Receipt}
                            description={`${stats.payments.paid} paid payments`}
                        />
                        <StatCard
                            title="Outstanding"
                            value={`৳${stats.payments.pendingAmount.toLocaleString()}`}
                            icon={TrendingUp}
                            badge={
                                stats.payments.failed > 0
                                    ? { label: `${stats.payments.failed} failed`, variant: "destructive" }
                                    : undefined
                            }
                            description={`${stats.payments.pending} payments pending`}
                        />
                    </>
                )}
            </div>
        </div>
    );
}