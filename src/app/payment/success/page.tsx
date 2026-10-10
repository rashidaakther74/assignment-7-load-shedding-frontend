"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Home, Receipt } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
            <div className="max-w-md w-full rounded-3xl border bg-card p-8 text-center shadow-xl space-y-6">

                {/* Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>

                {/* Title & Message */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                        Payment Successful!
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                    </p>
                </div>

                {/* Session / Transaction ID Box */}
                {sessionId && (
                    <div className="rounded-xl border bg-muted/40 p-3.5 text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <Receipt className="h-3.5 w-3.5 text-amber-500" />
                            <span>Stripe Session ID:</span>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground break-all">
                            {sessionId}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/dashboard" // আপনার My Payments পেইজের আসল লিংক এখানে দিতে পারেন
                        className={`${buttonVariants({ variant: "default" })} flex-1 gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white`}
                    >
                        Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/"
                        className={`${buttonVariants({ variant: "outline" })} gap-2`}
                    >
                        <Home className="h-4 w-4" /> Home
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}