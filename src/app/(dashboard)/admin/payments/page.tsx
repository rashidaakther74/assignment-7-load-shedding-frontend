"use client";

import {
    SearchIcon,
    Loader2Icon,
    CreditCardIcon,
    CircleAlert,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    EyeIcon,
    EyeOffIcon,
    CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    PAID: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const statusIcons = {
    PENDING: ClockIcon,
    PAID: CheckCircleIcon,
    FAILED: CircleAlert,
};

export default function AdminPaymentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "PAID" | "FAILED">("all");
    // শুরুতে false রাখা হয়েছে যাতে পেইজে ঢুকলেই নিচে লিস্ট না দেখায়, বাটনে ক্লিক করলেই কেবল দেখাবে!
    const [showAllPayments, setShowAllPayments] = useState(false);

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
        <div className="p-4 md:p-8 space-y-6 min-h-[85vh]">
            {/* Top Portal Header */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <CreditCardIcon className="h-3.5 w-3.5" />
                            <span>Revenue & Billing Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            All Payments
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor revenue summary metrics and click below to view all payment transactions.
                        </p>
                    </div>
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

            {/* Action Bar: Toggle "Get All Payments" */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                    type="button"
                    onClick={() => setShowAllPayments((prev) => !prev)}
                    variant={showAllPayments ? "default" : "outline"}
                    className={`h-12 px-6 rounded-xl font-semibold transition-all ${showAllPayments
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-0"
                            : "border-amber-500/30 hover:bg-amber-500/10 text-foreground"
                        }`}
                >
                    {showAllPayments ? (
                        <>
                            <EyeOffIcon className="mr-2 h-4 w-4" />
                            Hide All Payments
                        </>
                    ) : (
                        <>
                            <EyeIcon className="mr-2 h-4 w-4 text-amber-500" />
                            Get All Payments ({payments.length})
                        </>
                    )}
                </Button>
            </div>

            {/* Payments Table — শুধুমাত্র "Get All Payments" বাটনে ক্লিক করলেই নিচে দেখাবে */}
            {showAllPayments && (
                <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Payment Transactions</CardTitle>
                            <CardDescription>
                                Search by transaction ID, user name, or filter by payment status
                            </CardDescription>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-72">
                                <SearchIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by TrxID, user, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-background focus-visible:ring-amber-500"
                                />
                            </div>
                            <div className="relative w-full sm:w-44">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value as "all" | "PENDING" | "PAID" | "FAILED"
                                        )
                                    }
                                    className="w-full h-10 appearance-none pl-9 pr-8 border border-input bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="PAID">Paid</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                                <CircleAlert className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6 font-bold">Transaction ID</TableHead>
                                    <TableHead className="font-bold">User</TableHead>
                                    <TableHead className="text-right font-bold">Amount</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="pr-6 font-bold">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <Loader2Icon className="mx-auto h-7 w-7 animate-spin text-amber-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-12 text-destructive font-medium"
                                        >
                                            Failed to load payments
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-12 text-muted-foreground"
                                        >
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => {
                                        const StatusIcon =
                                            statusIcons[payment.status as keyof typeof statusIcons] ||
                                            ClockIcon;
                                        return (
                                            <TableRow
                                                key={payment.id}
                                                className="hover:bg-muted/20 transition-colors"
                                            >
                                                <TableCell className="pl-6 font-mono text-xs sm:text-sm max-w-[220px] truncate text-foreground">
                                                    {payment.trxId}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                                                            <UserIcon className="h-4 w-4" />
                                                        </span>
                                                        <div>
                                                            <p className="font-semibold text-sm text-foreground">
                                                                {payment.user?.name || "Unknown"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {payment.user?.email || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-extrabold tabular-nums text-foreground">
                                                    ৳{payment.amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[
                                                            payment.status as keyof typeof statusColors
                                                            ] || ""
                                                            }`}
                                                    >
                                                        <StatusIcon className="mr-1.5 h-3 w-3" />
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarIcon className="h-3.5 w-3.5 text-amber-500" />
                                                        {new Date(payment.createdAt).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}