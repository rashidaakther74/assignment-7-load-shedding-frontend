"use client";

import { PlusIcon, Loader2Icon, CalendarClock, MapPin, EditIcon, Trash2Icon, AlertTriangleIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useCreateSchedule, useGetSchedules, useUpdateSchedule, useDeleteSchedule } from "@/hook";
import { useGetAreas } from "@/hook";
import { toast } from "@/hook/use-toast";
import { useState } from "react";
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

const scheduleSchema = z.object({
    areaId: z.string().min(1, "Area is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    date: z.string().min(1, "Date is required"),
    reason: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function OperatorSchedulesPage() {
    const createScheduleMutation = useCreateSchedule();
    const updateScheduleMutation = useUpdateSchedule();
    const deleteScheduleMutation = useDeleteSchedule();
    const { data: schedulesResponse, isLoading: isLoadingSchedules } = useGetSchedules();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editSchedule, setEditSchedule] = useState<any>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const schedules: any[] = schedulesResponse?.data || [];
    const { data: areasResponse } = useGetAreas();
    const areas: any[] = areasResponse?.data || [];

    const createForm = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: { areaId: "", startTime: "", endTime: "", date: "", reason: "" },
    });

    const editForm = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: { areaId: "", startTime: "", endTime: "", date: "", reason: "" },
    });

    const onCreateSubmit = async (data: ScheduleFormData) => {
        try {
            await createScheduleMutation.mutateAsync(data);
            toast({ title: "Success", description: "Schedule created successfully" });
            createForm.reset();
            setIsDialogOpen(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({ title: "Error", description: error.response?.data?.message || "Failed to create schedule" });
        }
    };

    const onEditSubmit = async (data: ScheduleFormData) => {
        if (!editId) return;
        try {
            await updateScheduleMutation.mutateAsync({ id: editId, payload: data });
            toast({ title: "Success", description: "Schedule updated successfully" });
            setEditId(null);
            setEditSchedule(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({ title: "Error", description: error.response?.data?.message || "Failed to update schedule" });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteScheduleMutation.mutateAsync(id);
            toast({ title: "Success", description: "Schedule deleted successfully" });
            setDeleteConfirmId(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({ title: "Error", description: error.response?.data?.message || "Failed to delete schedule" });
            setDeleteConfirmId(null);
        }
    };

    const openCreateDialog = () => {
        createForm.reset({ areaId: "", startTime: "", endTime: "", date: "", reason: "" });
        setIsDialogOpen(true);
    };

    const handleEditClick = (schedule: any) => {
        setEditSchedule(schedule);
        setEditId(schedule.id);
        editForm.reset({
            areaId: schedule.areaId,
            startTime: new Date(schedule.startTime).toISOString().slice(0, 16),
            endTime: new Date(schedule.endTime).toISOString().slice(0, 16),
            date: new Date(schedule.date).toISOString().slice(0, 10),
            reason: schedule.reason || "",
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
                    <p className="text-muted-foreground">Create and manage load shedding schedules</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Schedule
                </Button>
            </div>

            {/* Create Schedule Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Schedule</DialogTitle>
                        <DialogDescription>Fill in the details below to create a load shedding schedule.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={createForm.control}
                                    name="areaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    <option value="">Select an area</option>
                                                    {areas.map((area: any) => (
                                                        <option key={area.id} value={area.id}>
                                                            {area.name} ({area.code}){area.district && ` - ${area.district}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={createForm.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reason (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Maintenance, Emergency, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={createForm.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createScheduleMutation.isPending}>
                                    {createScheduleMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Schedule"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Edit Schedule Dialog */}
            <Dialog open={!!editId} onOpenChange={(open) => !open && (setEditId(null), setEditSchedule(null))}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Update Schedule</DialogTitle>
                        <DialogDescription>Modify the schedule details.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={editForm.control}
                                    name="areaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    <option value="">Select an area</option>
                                                    {areas.map((area: any) => (
                                                        <option key={area.id} value={area.id}>
                                                            {area.name} ({area.code}){area.district && ` - ${area.district}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={editForm.control}
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reason (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Maintenance, Emergency, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="startTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={editForm.control}
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={updateScheduleMutation.isPending}>
                                    {updateScheduleMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Schedule"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Schedules List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Schedules</CardTitle>
                    <CardDescription>View and manage load shedding schedules</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingSchedules ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    ) : schedules.length > 0 ? (
                        <div className="space-y-3">
                            {schedules.map((schedule) => {
                                const isDeleting = deleteScheduleMutation.isPending && deleteConfirmId === schedule.id;
                                const startTime = new Date(schedule.startTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                const endTime = new Date(schedule.endTime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                                const date = new Date(schedule.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                });

                                return (
                                    <div
                                        key={schedule.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <CalendarClock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{schedule.area?.name || "Unknown Area"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {schedule.area?.code} {schedule.area?.district && `· ${schedule.area.district}`}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {date} · {startTime} - {endTime}
                                                </p>
                                                {schedule.reason && (
                                                    <p className="text-xs text-muted-foreground mt-1">Reason: {schedule.reason}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {deleteConfirmId === schedule.id ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Delete?</span>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(schedule.id)}
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <Trash2Icon className="h-4 w-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)} disabled={isDeleting}>
                                                        <AlertTriangleIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditClick(schedule)}
                                                        disabled={updateScheduleMutation.isPending}
                                                        className="gap-1"
                                                    >
                                                        <EditIcon className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteConfirmId(schedule.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <AlertCircleIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Schedules Yet</h3>
                            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                No load shedding schedules have been created yet. Click "Create Schedule" to add your first one.
                            </p>
                            <Button onClick={openCreateDialog}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Schedule
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}