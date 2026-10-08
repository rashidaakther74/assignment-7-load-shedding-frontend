import { Zap, Clock, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
    const highlights = [
        {
            icon: Clock,
            title: "Real-Time Updates",
            description: "Up-to-date schedules directly tracked across different zones and power sub-stations.",
        },
        {
            icon: ShieldCheck,
            title: "Reliable Accuracy",
            description: "Data verified through community crowdsourcing and verified regional outage reports.",
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Residents and businesses collaborating to report unscheduled drops and restorations.",
        },
    ];

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="border-b bg-muted/20 py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-amber-500 mb-6">
                        <Zap className="h-3.5 w-3.5 fill-current" /> Our Mission
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Empowering communities during power outages
                    </h1>
                    <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        We simplify power outage monitoring by bringing zone-wise schedules, historical data, and crowd alerts into one intuitive dashboard.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {highlights.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-xl border bg-card p-6 shadow-sm">
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Call to action */}
                    <div className="mt-16 rounded-2xl border bg-muted/30 p-8 text-center md:p-12">
                        <h2 className="text-2xl font-bold">Want to check your area schedule?</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Search by region, district, or sub-station to see planned disruptions.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Link href="/areas" className={buttonVariants({ variant: "default" })}>
                                View Area Schedules
                            </Link>
                            <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}