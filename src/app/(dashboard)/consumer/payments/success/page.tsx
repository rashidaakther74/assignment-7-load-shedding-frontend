"use client";

import { CheckCircleIcon, CreditCardIcon, ArrowLeftIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

    useEffect(() => {
        const trxId = searchParams.get("trxId") || searchParams.get("transaction_id") || searchParams.get("tran_id");
        const amount = searchParams.get("amount") || searchParams.get("total_amount");
        const status = searchParams.get("status") || searchParams.get("payment_status");
        const sessionId = searchParams.get("sessionId") || searchParams.get("session_id");

        if (trxId || amount || status || sessionId) {
            setPaymentData({ trxId, amount, status, sessionId });
        }
    }, [searchParams]);

    const handleCreatePaymentRecord = async () => {
        // Use sessionId as fallback for trxId (Stripe uses session_id as transaction ID)
        const trxId = paymentData?.trxId || paymentData?.sessionId;
        if (!trxId || !paymentData?.amount) {
            toast({ title: "Error", description: "Missing payment information" });
            return;
        }

        setIsProcessing(true);
        try {
            await createPaymentMutation.mutateAsync({
                amount: parseFloat(paymentData.amount),
                trxId: trxId,
            });
            toast({ title: "Success", description: "Payment record created successfully" });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create payment record",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const isSuccess = paymentData?.status === "success" || paymentData?.status === "SUCCESS" || paymentData?.status === "PAID";
    const isFailed = paymentData?.status === "failed" || paymentData?.status === "FAILED" || paymentData?.status === "FAIL";
    const isPending = !isSuccess && !isFailed && (paymentData?.status === "pending" || paymentData?.status === "PENDING");

    if (!paymentData || !(paymentData.trxId || paymentData.amount || paymentData.status || paymentData.sessionId)) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payment Status</h1>
                        <p className="text-muted-foreground">No payment information found</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <AlertCircleIcon className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
                        <h3 className="text-lg font-medium mb-2">Invalid Payment Callback</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            This page requires payment information from the payment gateway. Please return to the payments page and try again.
                        </p>
                        <Button onClick={() => router.push("/consumer/payments")}>
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Back to Payments
                            </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isSuccess ? "Payment Successful" : isFailed ? "Payment Failed" : "Payment Processing"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isSuccess
                            ? "Your payment has been completed successfully"
                            : isFailed
                            ? "Your payment could not be processed"
                            : "Your payment is being processed"}
                    </p>
                </div>
            </div>

            {/* Status Card */}
            <Card className={isSuccess ? "border-green-500" : isFailed ? "border-red-500" : "border-yellow-500"}>
                <CardContent className="pt-6">
                    <div className="text-center mb-6">
                        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                            isSuccess ? "bg-green-100 text-green-600" :
                            isFailed ? "bg-red-100 text-red-600" :
                            "bg-yellow-100 text-yellow-600"
                        }`}>
                            {isSuccess && <CheckCircleIcon className="h-8 w-8" />}
                            {isFailed && <AlertCircleIcon className="h-8 w-8" />}
                            {isPending && <Loader2Icon className="h-8 w-8 animate-spin" />}
                        </div>
                        <Badge
                            variant="default"
                            className={`text-lg px-4 py-2 ${
                                isSuccess ? "bg-green-100 text-green-800" :
                                isFailed ? "bg-red-100 text-red-800" :
                                "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {isSuccess ? "PAID" : isFailed ? "FAILED" : "PENDING"}
                        </Badge>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Transaction ID</p>
                                <p className="font-mono font-medium text-lg break-all">
                                    {paymentData.trxId || "N/A"}
                                </p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-bold text-2xl text-primary">৳{paymentData.amount ? parseFloat(paymentData.amount).toLocaleString() : "N/A"}</p>
                            </div>
                        </div>

                        {paymentData.sessionId && (
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Session ID</p>
                                <p className="font-mono text-sm break-all">{paymentData.sessionId}</p>
                            </div>
                        )}

                        {paymentData.status && (
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">Gateway Status</p>
                                <p className="font-medium capitalize">{paymentData.status}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {isSuccess && !createPaymentMutation.isSuccess && (
                            <Button
                                onClick={handleCreatePaymentRecord}
                                disabled={isProcessing || createPaymentMutation.isPending}
                                className="flex-1 gap-2"
                            >
                                {isProcessing || createPaymentMutation.isPending ? (
                                    <>
                                        <Loader2Icon className="h-4 w-4 animate-spin" />
                                        Saving Record...
                                    </>
                                ) : (
                                    <>
                                        <CreditCardIcon className="h-4 w-4" />
                                        Save Payment Record
                                    </>
                                )}
                            </Button>
                        )}

                        <Link href="/consumer/payments">
                            <Button variant="outline" className="flex-1 gap-2 justify-center">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                View Payment History
                            </Button>
                        </Link>

                        <Link href="/consumer">
                            <Button variant="outline" className="flex-1 gap-2 justify-center">
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Info */}
            {isSuccess && (
                <Card>
                    <CardContent className="pt-0">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-green-800">Payment Completed</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your payment has been processed successfully. The transaction has been recorded.
                                        {createPaymentMutation.isSuccess && " Payment record has been saved to your history."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isFailed && (
                <Card>
                    <CardContent className="pt-0">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-red-800">Payment Failed</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        Your payment could not be completed. This could be due to insufficient funds,
                                        expired card, or a temporary issue with the payment gateway.
                                    </p>
                                    <p className="text-sm text-red-700 mt-2">
                                        Please try again or contact support if the issue persists.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isPending && (
                <Card>
                    <CardContent className="pt-0">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Loader2Icon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0 animate-spin" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">Payment Pending</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Your payment is still being processed. This usually takes a few minutes.
                                        Please check your payment history later or refresh this page.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}