"use client";

import { useParams } from "next/navigation";
import { Loader2Icon, MapPinIcon, HashIcon, Building2Icon, CalendarIcon, ClockIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetAreaById } from "@/hook";
import type { Area } from "@/types";
import Link from "next/link";

export default function AreaDetailPage() {
    const params = useParams();
    const areaId = params.id as string;

    const { data: areaResponse, isLoading, error } = useGetAreaById(areaId);

    const area: Area | undefined = areaResponse?.data;

    if (isLoading) {
        return <AreaDetailSkeleton />;
    }

    if (error || !area) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <svg className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Area Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        The area you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/areas">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Areas
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back Link */}
                <Link
                    href="/areas"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Areas
                </Link>

                {/* Main Area Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPinIcon className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-2xl truncate">{area.name}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <HashIcon className="h-4 w-4 shrink-0" />
                                    <span className="font-mono font-medium text-lg">{area.code}</span>
                                </div>
                            </div>
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <MapPinIcon className="h-7 w-7" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 pb-6">
                        {/* District */}
                        {area.district && (
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Building2Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">District</p>
                                    <p className="text-lg font-medium text-foreground">{area.district}</p>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</p>
                                    <p className="text-sm font-medium text-foreground font-mono">
                                        {formatDate(area.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <ClockIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</p>
                                    <p className="text-sm font-medium text-foreground font-mono">
                                        {formatDate(area.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ID */}
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Area ID</p>
                            <code className="font-mono text-sm text-foreground break-all">{area.id}</code>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                            <Badge variant="outline" className="gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                Area
                            </Badge>
                        </div>
                    </CardFooter>
                </Card>

                {/* Related Info - Schedules & Users */}
                {(area.schedules && area.schedules.length > 0) || (area.users && area.users.length > 0) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Related Information</CardTitle>
                            <CardDescription>Additional details about this area</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {area.schedules && area.schedules.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        Schedules ({area.schedules.length})
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {area.schedules.map((schedule, index) => (
                                            <div key={schedule.id || index} className="p-3 bg-muted/50 rounded-lg border">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">
                                                        {formatDate(schedule.date)}
                                                    </span>
                                                    <span className="text-muted-foreground font-mono">
                                                        {schedule.startTime} - {schedule.endTime}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {area.users && area.users.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                        <Building2Icon className="h-4 w-4 text-muted-foreground" />
                                        Assigned Users ({area.users.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {area.users.map((user) => (
                                            <div key={user.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : null}
            </div>
        </div>
    );
}

function AreaDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-8 w-32" />
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-5 w-1/2 mt-2" />
                            </div>
                            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-6">
                        <Skeleton className="h-14 w-full rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 w-full rounded-lg" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                        </div>
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-60 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function formatDate(dateString: string): string {
    try {
        // Parse date-only string (YYYY-MM-DD) to avoid timezone issues
        const [year, month, day] = dateString?.split("-") || ["0000", "01", "01"];
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateString;
    }
}