"use client";

import { SearchIcon, Loader2Icon, CreditCardIcon, CircleAlert, CheckCircleIcon, ClockIcon, DownloadIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPayments } from "@/hook";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
};

const statusIcons = {
    PENDING: ClockIcon,
    PAID: CheckCircleIcon,
    FAILED: CircleAlert,
};

export default function AdminPaymentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "PAID" | "FAILED">("all");

    const { data: paymentsResponse, isLoading, error } = useGetPayments();
    const payments: any[] = paymentsResponse?.data || [];

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (payment.user && payment.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.user && payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPaid = payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
        .filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + p.amount, 0);

    const failedCount = payments.filter((p) => p.status === "FAILED").length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Payments</h1>
                    <p className="text-muted-foreground">View and manage all payment transactions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Collected"
                    value={`৳${totalPaid.toLocaleString()}`}
                    icon={CreditCardIcon}
                    description="Successfully completed payments"
                />
                <StatCard
                    title="Pending Amount"
                    value={`৳${totalPending.toLocaleString()}`}
                    icon={ClockIcon}
                    badge={{ label: "Awaiting", variant: "warning" }}
                    description="Payments being processed"
                />
                <StatCard
                    title="Failed Transactions"
                    value={failedCount}
                    icon={CircleAlert}
                    badge={failedCount > 0 ? { label: "Failed", variant: "destructive" } : undefined}
                    description="Failed payment attempts"
                />
                <StatCard
                    title="Total Transactions"
                    value={payments.length}
                    icon={CreditCardIcon}
                    description="All payment records"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-80">
                    <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by transaction ID, user name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "PENDING" | "PAID" | "FAILED")}
                        className="w-full appearance-none pl-9 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                        <option value="all">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                    </select>
                    <CircleAlert className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2Icon className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-destructive">
                                    Failed to load payments
                                </TableCell>
                            </TableRow>
                        ) : filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No payments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => {
                                const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || ClockIcon;
                                return (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-sm max-w-[200px] truncate">{payment.trxId}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{payment.user?.name || "Unknown"}</p>
                                                <p className="text-sm text-muted-foreground">{payment.user?.email || "N/A"}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium tabular-nums">৳{payment.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="default" className={statusColors[payment.status as keyof typeof statusColors] || ""}>
                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(payment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}