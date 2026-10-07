"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CreditCardIcon, CalendarClock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useGetMyComplaints } from "@/hook";
import { useGetMyPayments } from "@/hook";
import { useGetSchedules } from "@/hook";

export default function ConsumerOverviewPage() {
    const { data: complaintsResponse, isLoading: isLoadingComplaints } = useGetMyComplaints();
    const { data: paymentsResponse, isLoading: isLoadingPayments } = useGetMyPayments();
    const { data: schedulesResponse, isLoading: isLoadingSchedules } = useGetSchedules();

    const complaints: any[] = complaintsResponse?.data || [];
    const payments: any[] = paymentsResponse?.data || [];
    const schedules: any[] = schedulesResponse?.data || [];

    const pendingComplaints = complaints.filter((c) => c.status === "PENDING").length;
    const inProgressComplaints = complaints.filter((c) => c.status === "IN_PROGRESS").length;
    const resolvedComplaints = complaints.filter((c) => c.status === "RESOLVED").length;

    const totalPaid = payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments.filter((p) => p.status === "PENDING").length;
    const failedPayments = payments.filter((p) => p.status === "FAILED").length;

    const parseDateStr = (dateStr: string) => {
        const [year, month, day] = dateStr?.split("-") || ["0000", "01", "01"];
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };
    const upcomingSchedules = schedules.filter((s) => parseDateStr(s.date) >= new Date()).length;

    const isLoading = isLoadingComplaints || isLoadingPayments || isLoadingSchedules;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Consumer Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                    View your complaints, payments, and upcoming schedules.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
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
                ) : (
                    <>
                        <StatCard
                            title="Total Complaints"
                            value={complaints.length}
                            icon={AlertCircle}
                            description={`${pendingComplaints} pending · ${inProgressComplaints} in progress · ${resolvedComplaints} resolved`}
                            badge={pendingComplaints + inProgressComplaints > 0 ? { label: "Active", variant: "warning" } : { label: "All clear", variant: "success" }}
                        />
                        <StatCard
                            title="Total Paid"
                            value={`৳${totalPaid.toLocaleString()}`}
                            icon={CreditCardIcon}
                            description={`${payments.filter((p) => p.status === "PAID").length} successful payments`}
                        />
                        <StatCard
                            title="Pending Payments"
                            value={pendingPayments}
                            icon={CalendarClock}
                            badge={pendingPayments > 0 ? { label: "Awaiting", variant: "warning" } : { label: "None", variant: "muted" }}
                            description={failedPayments > 0 ? `${failedPayments} failed payments` : "All payments successful"}
                        />
                        <StatCard
                            title="Upcoming Schedules"
                            value={upcomingSchedules}
                            icon={CalendarClock}
                            badge={upcomingSchedules > 0 ? { label: "Scheduled", variant: "info" } : { label: "None", variant: "muted" }}
                            description={`${schedules.length} total schedules in your area`}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
