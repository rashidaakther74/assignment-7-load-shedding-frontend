import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Zap,
  Search,
  Map,
  ShieldAlert,
  Sparkles,
  Activity,
  BellRing,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-background py-20 md:py-28 lg:py-36 flex items-center min-h-[85vh]">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute -top-40 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="absolute bottom-0 left-10 -z-10 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Main Container with balanced padding */}
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-20 items-center">

          {/* Left Text Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-6 space-y-8">

            {/* Live Indicator Alert */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-time Outage Tracking Active</span>
            </div>

            {/* Heading & Description */}
            <div className="space-y-5 max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl xl:text-6xl leading-[1.15]">
                Stay Ahead of the{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                  Blackouts
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                সরাসরি আপনার এলাকার লোডশেডিংয়ের সময়সূচী, লাইভ এলার্ট এবং কাস্টম নোটিফিকেশন ট্র্যাক করুন। কোনো আকস্মিক বিদ্যুৎ বিভ্রাট ছাড়াই আগে থেকে পরিকল্পনা নিন।
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/areas"
                className={`${buttonVariants({ size: "lg", variant: "default" })} w-full sm:w-auto h-12 gap-2.5 px-8 text-base font-medium shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 transition-all hover:scale-[1.02]`}
              >
                <Search className="h-4 w-4" />
                Search Your Area
              </Link>
              <Link
                href="/areas"
                className={`${buttonVariants({ size: "lg", variant: "outline" })} w-full sm:w-auto h-12 gap-2.5 px-8 text-base font-medium bg-background/60 backdrop-blur-sm hover:bg-muted/80 transition-all`}
              >
                <Map className="h-4 w-4 text-amber-500" />
                See Live Map
              </Link>
            </div>

            {/* Quick Trust Stats */}
            <div className="w-full pt-6 border-t border-border/60">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <Zap className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="font-medium text-foreground">50+ Cities Tracking</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <Activity className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="font-medium text-foreground">Live Grid Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Illustrative Column */}
          <div className="lg:col-span-6 relative select-none w-full max-w-lg mx-auto lg:max-w-none">

            {/* Floating Decorative Notification Badge (Top Right) */}
            <div className="hidden sm:flex absolute -top-5 -right-4 z-20 items-center gap-3 rounded-xl border bg-card/95 p-3.5 shadow-xl backdrop-blur-md animate-bounce [animation-duration:4s]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                <BellRing className="h-5 w-5" />
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold text-foreground">Alert Triggered</p>
                <p className="text-[11px] text-muted-foreground">Outage in 15 mins</p>
              </div>
            </div>

            {/* Main Showcase Card */}
            <div className="relative rounded-3xl border border-border/80 bg-gradient-to-b from-muted/50 via-muted/20 to-background p-4 sm:p-6 shadow-2xl backdrop-blur-sm overflow-hidden group">

              {/* Inner Card Dashboard */}
              <div className="relative rounded-2xl border bg-card/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">

                {/* Card Header */}
                <div className="flex items-start justify-between border-b pb-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <ShieldAlert className="h-7 w-7 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Live Grid Status</h3>
                      <p className="text-xs text-muted-foreground">
                        Real-time localized forecast & schedules
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                  </span>
                </div>

                {/* Area Status Item 1 */}
                <div className="space-y-4">
                  <div className="rounded-xl border bg-background/60 p-4 space-y-3 transition-colors hover:border-amber-500/30">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                        DHAKA METRO
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-500 rounded-md bg-amber-500/10 px-2.5 py-1 font-semibold">
                        <Clock className="h-3 w-3" /> Next Outage 14:00
                      </span>
                    </div>

                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full w-[82%] rounded-full" />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                      <span>Power Restored: <strong className="text-foreground">82%</strong></span>
                      <span>Zone A & B Active</span>
                    </div>
                  </div>

                  {/* Area Status Item 2 */}
                  <div className="rounded-xl border bg-background/60 p-4 space-y-3 transition-colors hover:border-emerald-500/30">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        SYLHET DIVISION
                      </span>
                      <span className="text-xs text-emerald-500 rounded-md bg-emerald-500/10 px-2.5 py-1 font-semibold">
                        Stable Supply
                      </span>
                    </div>

                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[96%] rounded-full" />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                      <span>Grid Load: <strong className="text-foreground">Normal (96%)</strong></span>
                      <span>No Outage Scheduled</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                  <span>Updated just now</span>
                  <span className="text-amber-500 font-medium">Auto-refreshing every 30s</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}