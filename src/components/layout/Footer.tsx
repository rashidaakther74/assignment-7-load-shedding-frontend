"use client";

import Logo from "@/utils/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ShieldCheck, ArrowUpRight, Mail, MapPin } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    // ড্যাশবোর্ড বা অ্যাডমিন প্যানেলে থাকলে ফুটার হাইড থাকবে
    if (
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/complaints")
    ) {
        return null;
    }

    const navigation = {
        quickLinks: [
            { name: "Home", href: "/" },
            { name: "Areas", href: "/areas" },
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
        ],
        support: [
            { name: "Help Center", href: "/contact" },
            { name: "Report Outage", href: "/areas" },
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
        ],
    };

    return (
        <footer className="relative mt-auto border-t bg-background/95 backdrop-blur-sm overflow-hidden">
            {/* Subtle Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="absolute -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px]" />

            <div className="container mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">

                    {/* Brand Info (5 Columns on Large Screens) */}
                    <div className="lg:col-span-5 space-y-5">
                        <Logo />
                        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                            Real-time load shedding schedule tracker and notifications for your
                            neighborhood. Stay prepared and plan your day without unexpected
                            power cuts.
                        </p>

                        {/* Live Status Pill */}
                        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-medium text-foreground">All Grid Servers Operational</span>
                        </div>
                    </div>

                    {/* Quick Links (3 Columns) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                            Navigation
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {navigation.quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1 transition-colors hover:text-amber-500"
                                    >
                                        <span>{item.name}</span>
                                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 text-amber-500" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links (4 Columns) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                            Help & Support
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {navigation.support.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1 transition-colors hover:text-amber-500"
                                    >
                                        <span>{item.name}</span>
                                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 text-amber-500" />
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Quick Contact Mini Box */}
                        <div className="pt-2">
                            <div className="rounded-xl border bg-muted/30 p-3.5 text-xs text-muted-foreground space-y-1.5">
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Emergency Outage Support</span>
                                </div>
                                <p>Facing prolonged power cuts? Report directly from your area dashboard.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} LoadShedding Tracker. All rights reserved.</p>

                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-amber-500" />
                            Verified Grid Data
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}