
"use client";

import {
    CheckCircleIcon,
    CreditCardIcon,
    ArrowLeftIcon,
    Loader2Icon,
    AlertCircleIcon,
    PrinterIcon,
    ShieldCheckIcon,
    ReceiptTextIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "@/hook/use-toast";
import { useCreatePaymentRecord } from "@/hook";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const createPaymentMutation = useCreatePaymentRecord();

    const [isProcessing, setIsProcessing] = useState(false);

    const [paymentData, setPaymentData] = useState<{
        trxId?: string | null;
        amount?: string | null;
        status?: string | null;
        sessionId?: string | null;
    } | null>(null);

    // Read payment information from URL
    useEffect(() => {
        const trxId =
            searchParams.get("trxId") ||
            searchParams.get("transaction_id") ||
            searchParams.get("tran_id");

        const amount =
            searchParams.get("amount") ||
            searchParams.get("total_amount");

        const status =
            searchParams.get("status") ||
            searchParams.get("payment_status");

        const sessionId =
            searchParams.get("sessionId") ||
            searchParams.get("session_id");

        if (trxId || amount || status || sessionId) {
            setPaymentData({
                trxId,
                amount,
                status,
                sessionId,
            });
        }
    }, [searchParams]);

    // Save payment record
    const handleCreatePaymentRecord = async () => {
        const trxId = paymentData?.trxId || paymentData?.sessionId;

        if (!trxId || !paymentData?.amount) {
            toast({
                title: "Error",
                description: "Missing payment information",
            });
            return;
        }

        setIsProcessing(true);

        try {
            await createPaymentMutation.mutateAsync({
                amount: parseFloat(paymentData.amount),
                trxId: trxId,
            });

            toast({
                title: "Success",
                description: "Payment record created successfully",
            });
        } catch (err: unknown) {
            const error = err as {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };

            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to create payment record",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Payment status
    const normalizedStatus = paymentData?.status?.toUpperCase();

    const isSuccess =
        normalizedStatus === "SUCCESS" ||
        normalizedStatus === "PAID";

    const isFailed =
        normalizedStatus === "FAILED" ||
        normalizedStatus === "FAIL";

    const isPending =
        !isSuccess &&
        !isFailed &&
        (normalizedStatus === "PENDING");

    // Format amount
    const formattedAmount =
        paymentData?.amount &&
            Number.isFinite(Number.parseFloat(paymentData.amount))
            ? Number.parseFloat(paymentData.amount).toLocaleString(
                "en-BD",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )
            : "N/A";

    // No payment information
    if (
        !paymentData ||
        !(
            paymentData.trxId ||
            paymentData.amount ||
            paymentData.status ||
            paymentData.sessionId
        )
    ) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="rounded-xl bg-slate-900 p-3 text-white dark:bg-white dark:text-slate-900">
                            <ReceiptTextIcon className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Payment Center
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Payment Receipt
                            </h1>
                        </div>
                    </div>

                    <Card className="overflow-hidden rounded-3xl border-0 shadow-xl dark:bg-slate-900">
                        <CardContent className="px-6 py-12 text-center sm:px-12">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                <AlertCircleIcon className="h-8 w-8" />
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                No Payment Information Found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                This receipt needs payment information from the
                                payment gateway. Return to your payments page and
                                try again.
                            </p>

                            <Button
                                onClick={() => router.push("/consumer/payments")}
                                className="mt-7 rounded-xl"
                            >
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Back to Payments
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    // Status-based design
    const statusStyles = isSuccess
        ? {
            shell:
                "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
            icon:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
            label: "Payment Successful",
            description:
                "Your transaction has been completed. Keep this receipt for your records.",
        }
        : isFailed
            ? {
                shell:
                    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
                icon:
                    "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
                label: "Payment Failed",
                description:
                    "Your payment could not be completed. Please review the details below.",
            }
            : {
                shell:
                    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
                icon:
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
                label: "Payment Processing",
                description:
                    "Your payment is still being processed. Check your payment history later.",
            };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-3 py-8 dark:bg-slate-950 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-3xl">
                {/* Page Header */}
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-slate-900 p-3 text-white shadow-lg dark:bg-white dark:text-slate-900">
                            <ReceiptTextIcon className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                Payment Center
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                Payment Receipt
                            </h1>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => window.print()}
                        className="rounded-xl border-slate-300 bg-white dark:bg-slate-900"
                    >
                        <PrinterIcon className="mr-2 h-4 w-4" />
                        Print / Save PDF
                    </Button>
                </div>

                {/* Invoice Card */}
                <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none print:rounded-none print:border-0 print:shadow-none">
                    {/* Payment Status Header */}
                    <div
                        className={`px-6 py-8 ring-1 ring-inset sm:px-10 ${statusStyles.shell}`}
                    >
                        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                            <div
                                className={`mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:mb-0 sm:mr-5 ${statusStyles.icon}`}
                            >
                                {isSuccess ? (
                                    <CheckCircleIcon className="h-9 w-9" />
                                ) : isFailed ? (
                                    <AlertCircleIcon className="h-9 w-9" />
                                ) : (
                                    <Loader2Icon className="h-9 w-9 animate-spin" />
                                )}
                            </div>

                            <div className="flex-1">
                                <Badge className="mb-3 border-0 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-current shadow-none dark:bg-black/20">
                                    {isSuccess
                                        ? "Paid"
                                        : isFailed
                                            ? "Failed"
                                            : "Pending"}
                                </Badge>

                                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    {statusStyles.label}
                                </h2>

                                <p className="mt-2 max-w-lg text-sm leading-6 opacity-85">
                                    {statusStyles.description}
                                </p>
                            </div>

                            <div className="mt-6 text-center sm:ml-5 sm:mt-1 sm:text-right">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                                    Total Amount
                                </p>

                                <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                                    ৳{formattedAmount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        {/* Invoice Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-slate-200 px-6 py-6 dark:border-slate-700 sm:px-10">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Payment Receipt
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                    Transaction Summary
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <ShieldCheckIcon className="h-4 w-4" />
                                Secure payment via Stripe
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="px-6 py-7 sm:px-10">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Transaction ID
                                    </p>

                                    <p className="mt-2 break-all font-mono text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">
                                        {paymentData.trxId ||
                                            paymentData.sessionId ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Gateway Status
                                    </p>

                                    <p className="mt-2 font-semibold capitalize text-slate-800 dark:text-slate-100">
                                        {paymentData.status || "Not provided"}
                                    </p>
                                </div>

                                {paymentData.sessionId && (
                                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:col-span-2">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Stripe Session ID
                                        </p>

                                        <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-600 dark:text-slate-300">
                                            {paymentData.sessionId}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Invoice Divider */}
                            <div className="my-8 border-t border-dashed border-slate-200 dark:border-slate-700" />

                            {/* Invoice Amount Breakdown */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-slate-500">
                                        Payment Method
                                    </span>

                                    <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                        <CreditCardIcon className="h-4 w-4 text-slate-400" />
                                        Stripe Checkout
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <span className="text-slate-500">
                                        Payment Status
                                    </span>

                                    <span
                                        className={`font-bold ${isSuccess
                                            ? "text-emerald-600"
                                            : isFailed
                                                ? "text-rose-600"
                                                : "text-amber-600"
                                            }`}
                                    >
                                        {isSuccess
                                            ? "Paid"
                                            : isFailed
                                                ? "Failed"
                                                : "Pending"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                        Total Amount
                                    </span>

                                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        ৳{formattedAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Success Message */}
                            {isSuccess && (
                                <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                                        <div>
                                            <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                                                Thank you for your payment!
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-400">
                                                {createPaymentMutation.isSuccess
                                                    ? "Your payment record has been saved to your history."
                                                    : "Your payment was successful. You can save this receipt for your records."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Failed Message */}
                            {isFailed && (
                                <div className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
                                    Please try your payment again or contact support
                                    if the issue continues.
                                </div>
                            )}

                            {/* Pending Message */}
                            {isPending && (
                                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                    Your payment is still being processed. Please check
                                    your payment history later.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
                    {isSuccess && !createPaymentMutation.isSuccess && (
                        <Button
                            onClick={handleCreatePaymentRecord}
                            disabled={
                                isProcessing || createPaymentMutation.isPending
                            }
                            className="min-h-12 flex-1 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            {isProcessing || createPaymentMutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Record...
                                </>
                            ) : (
                                <>
                                    <CreditCardIcon className="mr-2 h-4 w-4" />
                                    Save Payment Record
                                </>
                            )}
                        </Button>
                    )}

                    <Link href="/consumer/payments" className="flex-1">
                        <Button
                            variant="outline"
                            className="min-h-12 w-full rounded-xl border-slate-300 bg-white font-semibold dark:border-slate-700 dark:bg-slate-900"
                        >
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            View Payment History
                        </Button>
                    </Link>

                    <Link href="/consumer" className="flex-1">
                        <Button
                            variant="outline"
                            className="min-h-12 w-full rounded-xl border-slate-300 bg-white font-semibold dark:border-slate-700 dark:bg-slate-900"
                        >
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-slate-400 print:hidden">
                    This receipt is generated from the payment details returned
                    to this page.
                </p>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          main {
            min-height: auto !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
        </main>
    );
}
