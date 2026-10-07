"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon, Loader2Icon, MapPinIcon, HashIcon, Building2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetAreas } from "@/hook";
import type { Area } from "@/types";

export default function PublicAreasPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: areasResponse, isLoading, error, refetch } = useGetAreas();

    const areas: Area[] = areasResponse?.data || [];

    const filteredAreas = areas.filter((area: Area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (area.district && area.district.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-background">
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                            Available Areas
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Browse all available service areas. Search by name, code, or district to find what you're looking for.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-10">
                        <div className="relative">
                            <SearchIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search areas by name, code, or district..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 text-base"
                                aria-label="Search areas"
                            />
                            {searchTerm && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                >
                                    <span className="sr-only">Clear search</span>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </Button>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground text-center">
                            {filteredAreas.length} of {areas.length} area{areas.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {/* Areas Grid */}
                    <div className="space-y-6">
                        {isLoading ? (
                            /* Loading Skeletons */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <AreaCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : error ? (
                            /* Error State */
                            <div className="text-center py-16">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                    <svg className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-2">Failed to load areas</h2>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Something went wrong while fetching the areas. Please try again later.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => refetch()}
                                    className="gap-2"
                                >
                                    <Loader2Icon className="h-4 w-4" />
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredAreas.length === 0 ? (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <SearchIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-2">
                                    {searchTerm ? "No matching areas found" : "No areas available"}
                                </h2>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {searchTerm
                                        ? "Try adjusting your search terms or clear the search to see all areas."
                                        : "There are currently no areas available. Check back later."}
                                </p>
                                {searchTerm && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchTerm("")}
                                        className="gap-2"
                                    >
                                        <SearchIcon className="h-4 w-4" />
                                        Clear Search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            /* Areas Grid */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAreas.map((area: Area) => (
                                    <AreaCard key={area.id} area={area} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function AreaCard({ area }: { area: Area }) {
    return (
        <Link href={`/areas/${area.id}`} className="block text-decoration-none">
            <Card className="h-full transition-shadow hover:shadow-md hover:border-primary/50 border-border">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{area.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <HashIcon className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-mono font-medium">{area.code}</span>
                            </div>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MapPinIcon className="h-5 w-5" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                    {area.district && (
                        <div className="flex items-center gap-2 text-sm">
                            <Building2Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-foreground font-medium">{area.district}</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                        <Badge variant="outline" className="gap-1">
                            <MapPinIcon className="h-3 w-3" />
                            Area
                        </Badge>
                        <span className="font-mono">
                            ID: {area.id.slice(0, 8)}...
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

function AreaCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardFooter>
        </Card>
    );
}