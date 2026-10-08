"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // এখানে আপনার API Call বা সাবমিট হ্যান্ডলার যোগ করতে পারেন
        setSubmitted(true);
    };

    return (
        <main className="flex-1 py-12 md:py-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Get in touch
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        Have questions about load shedding schedules or want to report an outage error?
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-amber-500">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Email</h4>
                                <p className="text-sm text-muted-foreground">support@loadshedding.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-amber-500">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Phone</h4>
                                <p className="text-sm text-muted-foreground">+880 1700-000000</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-amber-500">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Office</h4>
                                <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm md:p-8">
                        {submitted ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                                    ✓
                                </div>
                                <h3 className="text-lg font-semibold">Message Sent!</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Thank you for reaching out. We will get back to you shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your name"
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="your.email@example.com"
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Outage report, Feedback, etc."
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Write your message here..."
                                        className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <Button type="submit" className="w-full sm:w-auto">
                                    <Send className="mr-2 h-4 w-4" /> Send Message
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}