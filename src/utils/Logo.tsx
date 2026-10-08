// components/Logo.tsx
import Link from "next/link";
import { ZapOff, Zap } from "lucide-react";

interface LogoProps {
    className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
    return (
        <Link
            href="/"
            className={`group flex items-center gap-2.5 transition-all ${className}`}
        >
            {/* Icon Badge */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-background group-hover:shadow-md group-hover:shadow-amber-500/20">
                <ZapOff className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </div>

            {/* Brand Text */}
            <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-foreground">
                    Load<span className="text-amber-500">Shedding</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    Tracker
                </span>
            </div>
        </Link>
    );
}