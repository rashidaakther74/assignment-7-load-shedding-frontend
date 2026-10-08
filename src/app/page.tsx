import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Zap, Search, Map, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-background py-16 md:py-24 lg:py-32">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-40 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[80px]" />
      <div className="absolute top-10 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-[100px] md:bg-amber-500/10" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text Column */}
          <div className="space-y-6 lg:col-span-6 text-center lg:text-left">
            {/* Live Indicator Alert */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-amber-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <Sparkles className="h-3 w-3 inline" /> Real-time Outage Tracking Active
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Stay Ahead of the{" "}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                Blackouts
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              সরাসরি আপনার এলাকার লোডশেডিংয়ের সময়সূচী, লাইভ এলার্ট এবং কাস্টম নোটিফিকেশন ট্র্যাক করুন। কোনো আকস্মিক বিদ্যুৎ বিভ্রাট ছাড়াই আগে থেকে পরিকল্পনা নিন।
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/areas"
                className={`${buttonVariants({ size: "lg", variant: "default" })} gap-2 px-6 shadow-md shadow-amber-500/10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700`}
              >
                <Search className="h-4.5 w-4.5" /> Search Your Area
              </Link>
              <Link
                href="/areas"
                className={`${buttonVariants({ size: "lg", variant: "outline" })} gap-2 px-6`}
              >

                <Map className="h-4.5 w-4.5" />
                See Live Map
              </Link>
            </div>

            {/* Quick trust stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 border-t pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>50+ Cities Tracking</span>
              </div>
              <div className="flex items-center gap-1.5 border-l pl-6">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span>Live Updates</span>
              </div>
            </div>
          </div>

          {/* Right Visual Illustrative Column */}
          <div className="hidden lg:col-span-6 lg:block relative select-none">
            <div className="relative mx-auto max-w-lg aspect-square rounded-2xl border bg-gradient-to-tr from-muted/50 to-muted/10 p-6 shadow-2xl backdrop-blur-sm overflow-hidden group">
              {/* Overlay graphics */}
              <div className="absolute inset-0 bg-grid-white/[0.02]" />

              {/* Mock visualization */}
              <div className="relative h-full w-full rounded-xl border border-dashed border-muted bg-background/50 flex flex-col justify-center items-center text-center p-6 space-y-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/5 group-hover:scale-105 transition-transform duration-300">
                  <ShieldAlert className="h-8 w-8 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-foreground">Interactive Map & Schedules</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Get up-to-the-minute localized forecasts and timeline graphs for all districts.
                  </p>
                </div>

                {/* Sub-UI Indicator panel */}
                <div className="w-full max-w-xs rounded-lg border bg-card p-3 shadow-sm text-left text-xs space-y-2.5">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground"><Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> DHAKA METRO</span>
                    <span className="text-amber-500 rounded bg-amber-500/10 px-1.5 py-0.5 font-medium scale-95">Next Outage 14:00</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[82%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Restored: 82%</span>
                    <span>Zone A & B Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}