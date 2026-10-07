"use client";

import { PlusIcon, Loader2Icon, CreditCardIcon, CircleAlert, CheckCircleIcon, ClockIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCheckoutSession, useGetMyPayments } from "@/hook";
import { toast } from "@/hook/use-toast";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";

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

export default function ConsumerPaymentsPage() {
    const createCheckoutMutation = useCreateCheckoutSession();
    const createPaymentMutation = useCreatePaymentRecord();
    const { data: myPayments, isLoading: isLoadingPayments } = useGetMyPayments();
    const [amount, setAmount] = useState("");
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const handlePayment = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast({ title: "Error", description: "Please enter a valid amount" });
            return;
        }

        setIsPaymentProcessing(true);
        try {
            const response = await createCheckoutMutation.mutateAsync({ amount: parseFloat(amount) });
            if (response.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to initiate payment",
            });
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    const totalPaid = myPayments?.data
        ?.filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    const totalPending = myPayments?.data
        ?.filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    const failedCount = myPayments?.data?.filter((p) => p.status === "FAILED").length || 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Payments</h1>
                    <p className="text-muted-foreground">View payment history and make new payments</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Paid"
                    value={`৳${totalPaid.toLocaleString()}`}
                    icon={CreditCardIcon}
                    description="Successfully completed payments"
                />
                <StatCard
                    title="Pending"
                    value={`৳${totalPending.toLocaleString()}`}
                    icon={ClockIcon}
                    badge={{ label: "Awaiting", variant: "warning" }}
                    description="Payments being processed"
                />
                <StatCard
                    title="Failed"
                    value={failedCount}
                    icon={CircleAlert}
                    badge={failedCount > 0 ? { label: "Failed", variant: "destructive" } : undefined}
                    description="Failed payment attempts"
                />
                <StatCard
                    title="Total Transactions"
                    value={myPayments?.data?.length || 0}
                    icon={CreditCardIcon}
                    description="All payment records"
                />
            </div>

            {/* Make Payment Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Make a Payment</CardTitle>
                    <CardDescription>Enter amount and proceed to secure checkout</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="relative w-full sm:w-48">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                            <Input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-7"
                                min="1"
                                step="1"
                            />
                        </div>
                        <Button
                            onClick={handlePayment}
                            disabled={isPaymentProcessing || createCheckoutMutation.isPending || !amount}
                            className="gap-2"
                        >
                            {isPaymentProcessing || createCheckoutMutation.isPending ? (
                                <>
                                    <Loader2Icon className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCardIcon className="h-4 w-4" />
                                    Pay Now
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All your payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingPayments ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : myPayments?.data && myPayments.data.length > 0 ? (
                        <div className="space-y-3">
                            {myPayments.data.map((payment) => {
                                const StatusIcon = statusIcons[payment.status as keyof typeof statusIcons] || ClockIcon;
                                return (
                                    <div
                                        key={payment.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-muted rounded-lg">
                                                <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Transaction: {payment.trxId.slice(0, 20)}...</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xl font-bold tabular-nums">৳{payment.amount.toLocaleString()}</p>
                                            </div>
                                            <Badge className={statusColors[payment.status as keyof typeof statusColors] || ""} variant="default">
                                                <StatusIcon className="mr-1 h-3 w-3" />
                                                {payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Payments Yet</h3>
                            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                You haven't made any payments yet. Use the form above to make your first payment.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Import here to avoid circular dependency
import { useCreatePaymentRecord } from "@/hook";