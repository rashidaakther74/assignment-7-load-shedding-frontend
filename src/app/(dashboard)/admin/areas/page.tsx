"use client";

import { useState } from "react";
import {
    PlusIcon,
    EditIcon,
    Trash2Icon,
    SearchIcon,
    Loader2Icon,
    MapPinIcon,
    HashIcon,
    Building2Icon,
    AlertTriangleIcon,
    ListFilterIcon,
    SparklesIcon,
    EyeIcon,
    EyeOffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAreas, useCreateArea, useUpdateArea, useDeleteArea } from "@/hook";
import { toast } from "@/hook/use-toast";
import type { Area } from "@/types";

const areaSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    district: z.string().optional(),
});

type AreaFormData = z.infer<typeof areaSchema>;

export default function AreasPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Area | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    // শুরুতে false রাখা হয়েছে যাতে পেইজে ঢুকলেই নিচে লিস্ট না দেখায়, বাটনে ক্লিক করলেই কেবল দেখাবে!
    const [showAllAreas, setShowAllAreas] = useState(false);

    const { data: areasResponse, isLoading, error } = useGetAreas();
    const createAreaMutation = useCreateArea();
    const updateAreaMutation = useUpdateArea();
    const deleteAreaMutation = useDeleteArea();

    const areas: Area[] = areasResponse?.data || [];

    const filteredAreas = areas.filter(
        (area: Area) =>
            area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (area.district && area.district.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const uniqueDistricts = new Set(
        areas.map((a) => a.district?.trim()).filter(Boolean)
    ).size;

    const createForm = useForm<AreaFormData>({
        resolver: zodResolver(areaSchema),
        defaultValues: { name: "", code: "", district: "" },
    });

    const editForm = useForm<AreaFormData>({
        resolver: zodResolver(areaSchema),
        defaultValues: { name: "", code: "", district: "" },
    });

    const onCreateSubmit = async (data: AreaFormData) => {
        try {
            await createAreaMutation.mutateAsync(data);
            toast({ title: "Success", description: "Area created successfully" });
            createForm.reset();
            setCreateOpen(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create area",
            });
        }
    };

    const onEditSubmit = async (data: AreaFormData) => {
        if (!editData) return;
        try {
            await updateAreaMutation.mutateAsync({ id: editData.id, payload: data });
            toast({ title: "Success", description: "Area updated successfully" });
            setEditData(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update area",
            });
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteAreaMutation.mutateAsync(deleteId);
            toast({ title: "Success", description: "Area deleted successfully" });
            setDeleteId(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete area",
            });
        }
    };

    const handleEditClick = (area: Area) => {
        setEditData(area);
        editForm.reset({
            name: area.name,
            code: area.code,
            district: area.district || "",
        });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-[85vh]">
            {/* Top Portal Header */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            <span>Grid Zone Management Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Areas & Zones
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage areas and their information from two simple actions below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Total Registered Areas
                            </p>
                            <p className="text-3xl font-extrabold text-foreground mt-1">
                                {areas.length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <MapPinIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Covered Districts
                            </p>
                            <p className="text-3xl font-extrabold text-foreground mt-1">
                                {uniqueDistricts}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <Building2Icon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Simple Two-Button Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                    type="button"
                    onClick={() => setShowAllAreas((prev) => !prev)}
                    variant={showAllAreas ? "default" : "outline"}
                    className={`h-12 px-6 rounded-xl font-semibold transition-all ${showAllAreas
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-0"
                            : "border-amber-500/30 hover:bg-amber-500/10 text-foreground"
                        }`}
                >
                    {showAllAreas ? (
                        <>
                            <EyeOffIcon className="mr-2 h-4 w-4" />
                            Hide All Areas
                        </>
                    ) : (
                        <>
                            <EyeIcon className="mr-2 h-4 w-4 text-amber-500" />
                            Get All Areas ({areas.length})
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="h-12 px-6 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 transition-all"
                >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add New Area
                </Button>
            </div>

            {/* All Areas List — শুধুমাত্র "Get All Areas" বাটনে ক্লিক করলেই নিচে দেখাবে */}
            {showAllAreas && (
                <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold">All Registered Areas</CardTitle>
                            <CardDescription>
                                Search, edit, or delete areas from the list below
                            </CardDescription>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <SearchIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search areas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-background focus-visible:ring-amber-500"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6 font-bold">Name</TableHead>
                                    <TableHead className="font-bold">Code</TableHead>
                                    <TableHead className="font-bold">District</TableHead>
                                    <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12">
                                            <Loader2Icon className="mx-auto h-7 w-7 animate-spin text-amber-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-12 text-destructive font-medium"
                                        >
                                            Failed to load areas
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAreas.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-12 text-muted-foreground"
                                        >
                                            No areas found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAreas.map((area: Area) => (
                                        <TableRow
                                            key={area.id}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <TableCell className="pl-6 font-semibold text-foreground">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                                        <MapPinIcon className="h-4 w-4" />
                                                    </span>
                                                    <span>{area.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono text-xs bg-muted/40 px-2.5 py-0.5 rounded-md"
                                                >
                                                    <HashIcon className="h-3 w-3 mr-1 text-amber-500" />
                                                    {area.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-medium">
                                                {area.district || "-"}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(area)}
                                                        className="h-8 px-3 rounded-lg border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5"
                                                    >
                                                        <EditIcon className="h-3.5 w-3.5" />
                                                        <span className="text-xs font-semibold">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 rounded-lg border-red-500/20 text-red-600 hover:text-red-700 hover:bg-red-500/10 gap-1.5"
                                                        onClick={() => setDeleteId(area.id)}
                                                    >
                                                        <Trash2Icon className="h-3.5 w-3.5" />
                                                        <span className="text-xs font-semibold">Delete</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Create Area Dialog Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <SparklesIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Create New Area</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new area.
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Area name"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Area code"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                District (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="District name"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreateOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createAreaMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
                                    {createAreaMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Area"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Edit Area Dialog */}
            <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <EditIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Edit Area</DialogTitle>
                        <DialogDescription>Update the area details below.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Area name"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Area code"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editForm.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">
                                                District (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="District name"
                                                    className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditData(null)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateAreaMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
                                    {updateAreaMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Area"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="flex flex-col items-center text-center space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <AlertTriangleIcon className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Area</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete this area? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                            disabled={deleteAreaMutation.isPending}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteAreaMutation.isPending}
                            className="flex-1 rounded-xl font-semibold"
                        >
                            {deleteAreaMutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}