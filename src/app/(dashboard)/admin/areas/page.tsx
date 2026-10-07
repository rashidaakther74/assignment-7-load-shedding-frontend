"use client";

import { useState } from "react";
import { PlusIcon, EditIcon, Trash2Icon, SearchIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

    const { data: areasResponse, isLoading, error } = useGetAreas();
    const createAreaMutation = useCreateArea();
    const updateAreaMutation = useUpdateArea();
    const deleteAreaMutation = useDeleteArea();

    const areas: Area[] = areasResponse?.data || [];

    const filteredAreas = areas.filter((area: Area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (area.district && area.district.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Areas</h1>
                    <p className="text-muted-foreground">Manage areas and their information</p>
                </div>

                {/* Create Area Dialog Trigger Button */}
                <Button onClick={() => setCreateOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Area
                </Button>

                {/* Create Area Dialog Modal */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Area</DialogTitle>
                            <DialogDescription>Fill in the details below to create a new area.</DialogDescription>
                        </DialogHeader>
                        <FormProvider {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={createForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Area name" {...field} />
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
                                                <FormLabel>Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Area code" {...field} />
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
                                                <FormLabel>District (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="District name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createAreaMutation.isPending}>
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
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-64">
                    <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search areas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <Loader2Icon className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-destructive">
                                    Failed to load areas
                                </TableCell>
                            </TableRow>
                        ) : filteredAreas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No areas found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAreas.map((area: Area) => (
                                <TableRow key={area.id}>
                                    <TableCell className="font-medium">{area.name}</TableCell>
                                    <TableCell>{area.code}</TableCell>
                                    <TableCell>{area.district || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(area)}
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(area.id)}
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Area</DialogTitle>
                        <DialogDescription>Update the area details.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Area name" {...field} />
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
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Area code" {...field} />
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
                                            <FormLabel>District (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="District name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={updateAreaMutation.isPending}>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Area</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this area? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteAreaMutation.isPending}
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