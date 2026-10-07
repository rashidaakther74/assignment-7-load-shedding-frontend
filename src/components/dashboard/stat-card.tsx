import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    badge?: { label: string; variant?: "success" | "warning" | "destructive" | "info" | "muted" };
}

export function StatCard({ title, value, description, icon: Icon, badge }: StatCardProps) {
    return (
        <Card className="gap-2 py-4">
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                    {title}
                </CardDescription>
                <Icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
                    {badge ? (
                        <Badge variant={badge.variant ?? "muted"}>{badge.label}</Badge>
                    ) : null}
                </div>
                {description ? (
                    <p className="text-muted-foreground text-xs">{description}</p>
                ) : null}
            </CardContent>
        </Card>
    );
}
