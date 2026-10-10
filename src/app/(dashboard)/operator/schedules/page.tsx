"use client";

import {
    PlusIcon,
    Loader2Icon,
    CalendarClock,
    MapPin,
    EditIcon,
    Trash2Icon,
    AlertTriangleIcon,
    AlertCircleIcon,
    EyeIcon,
    EyeOffIcon,
    SparklesIcon,
    ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
    zoneId: z.string().min(1, "Zone is required"),
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
    // শুরুতে false রাখা হয়েছে যাতে পেইজে ঢুকলেই নিচে লিস্ট না দেখায়, বাটনে ক্লিক করলেই কেবল দেখাবে!
    const [showAllSchedules, setShowAllSchedules] = useState(false);

    const schedules: any[] = schedulesResponse?.data || [];
    const { data: areasResponse } = useGetAreas();
    const areas: any[] = areasResponse?.data || [];

    const parseDateStr = (dateStr: string) => {
        const [year, month, day] = dateStr?.split("-") || ["0000", "01", "01"];
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };
    const upcomingCount = schedules.filter((s) => parseDateStr(s.date) >= new Date()).length;

    const createForm = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: { zoneId: "", startTime: "", endTime: "", date: "", reason: "" },
    });

    const editForm = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: { zoneId: "", startTime: "", endTime: "", date: "", reason: "" },
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
        createForm.reset({ zoneId: "", startTime: "", endTime: "", date: "", reason: "" });
        setIsDialogOpen(true);
    };

    const handleEditClick = (schedule: any) => {
        setEditSchedule(schedule);
        setEditId(schedule.id);
        const formatTime = (timeStr: string) => timeStr?.slice(0, 5) || "";
        const formatDate = (dateStr: string) => dateStr?.slice(0, 10) || "";
        editForm.reset({
            zoneId: schedule.zoneId || schedule.areaId,
            startTime: formatTime(schedule.startTime),
            endTime: formatTime(schedule.endTime),
            date: formatDate(schedule.date),
            reason: schedule.reason || "",
        });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-[85vh]">
            {/* Top Portal Header */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <CalendarClock className="h-3.5 w-3.5" />
                            <span>Outage Schedule Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Schedule Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Create new load shedding schedules or view and manage all existing slots below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Total Schedules
                            </p>
                            <p className="text-3xl font-extrabold text-foreground mt-1">
                                {schedules.length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <CalendarClock className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Upcoming Outages
                            </p>
                            <p className="text-3xl font-extrabold text-foreground mt-1">
                                {upcomingCount}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                            <ClockIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Available Zones
                            </p>
                            <p className="text-3xl font-extrabold text-foreground mt-1">
                                {areas.length}
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <MapPin className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Simple Two-Button Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                    type="button"
                    onClick={() => setShowAllSchedules((prev) => !prev)}
                    variant={showAllSchedules ? "default" : "outline"}
                    className={`h-12 px-6 rounded-xl font-semibold transition-all ${showAllSchedules
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-0"
                            : "border-amber-500/30 hover:bg-amber-500/10 text-foreground"
                        }`}
                >
                    {showAllSchedules ? (
                        <>
                            <EyeOffIcon className="mr-2 h-4 w-4" />
                            Hide All Schedules
                        </>
                    ) : (
                        <>
                            <EyeIcon className="mr-2 h-4 w-4 text-amber-500" />
                            Get All Schedules ({schedules.length})
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={openCreateDialog}
                    className="h-12 px-6 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 transition-all"
                >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Schedule
                </Button>
            </div>

            {/* Schedules List — শুধুমাত্র "Get All Schedules" বাটনে ক্লিক করলেই নিচে দেখাবে */}
            {showAllSchedules && (
                <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-lg font-bold">All Schedules</CardTitle>
                            <CardDescription>
                                View, edit, or delete load shedding schedules below
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="w-fit px-3 py-1 text-xs font-semibold">
                            Total: {schedules.length}
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoadingSchedules ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : schedules.length > 0 ? (
                            <div className="space-y-3">
                                {schedules.map((schedule) => {
                                    const parseTime = (timeStr: string) => {
                                        const [hours, minutes] = timeStr?.split(":") || ["00", "00"];
                                        return { hour: parseInt(hours), minute: parseInt(minutes) };
                                    };
                                    const parseDate = (dateStr: string) => {
                                        const [year, month, day] = dateStr?.split("-") || ["0000", "01", "01"];
                                        return {
                                            year: parseInt(year),
                                            month: parseInt(month) - 1,
                                            day: parseInt(day),
                                        };
                                    };
                                    const startTimeObj = parseTime(schedule.startTime);
                                    const endTimeObj = parseTime(schedule.endTime);
                                    const dateObj = parseDate(schedule.date);
                                    const startTime = new Date(
                                        0,
                                        0,
                                        0,
                                        startTimeObj.hour,
                                        startTimeObj.minute
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    const endTime = new Date(
                                        0,
                                        0,
                                        0,
                                        endTimeObj.hour,
                                        endTimeObj.minute
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    const date = new Date(
                                        dateObj.year,
                                        dateObj.month,
                                        dateObj.day
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    });

                                    return (
                                        <div
                                            key={schedule.id}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-l-4 border-l-amber-500 rounded-xl bg-card/60 hover:bg-muted/20 transition-all shadow-sm"
                                        >
                                            <div className="flex items-start sm:items-center gap-4 flex-1">
                                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
                                                    <CalendarClock className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-bold text-base text-foreground">
                                                            {schedule.area?.name || "Unknown Area"}
                                                        </p>
                                                        {schedule.area?.code && (
                                                            <Badge
                                                                variant="outline"
                                                                className="font-mono text-xs bg-muted/40"
                                                            >
                                                                {schedule.area.code}
                                                            </Badge>
                                                        )}
                                                        {schedule.area?.district && (
                                                            <span className="text-xs text-muted-foreground">
                                                                · {schedule.area.district}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground/90">
                                                        {date} ·{" "}
                                                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                                            {startTime} - {endTime}
                                                        </span>
                                                    </p>
                                                    {schedule.reason && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Reason: {schedule.reason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 shrink-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(schedule)}
                                                    disabled={updateScheduleMutation.isPending}
                                                    className="h-9 px-3 rounded-lg border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5"
                                                >
                                                    <EditIcon className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-semibold">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteConfirmId(schedule.id)}
                                                    className="h-9 px-3 rounded-lg border-red-500/20 text-red-600 hover:text-red-700 hover:bg-red-500/10 gap-1.5"
                                                >
                                                    <Trash2Icon className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-semibold">Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                                    <AlertCircleIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">No Schedules Yet</h3>
                                <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                                    No load shedding schedules have been created yet. Click &quot;Create Schedule&quot; to add your first one.
                                </p>
                                <Button
                                    onClick={openCreateDialog}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Create Schedule
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Create Schedule Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <SparklesIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Create New Schedule</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a load shedding schedule.
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={createForm.control}
                                    name="zoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Zone</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full h-11 border border-input bg-background rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                >
                                                    <option value="">Select a zone</option>
                                                    {areas.map((area: any) => (
                                                        <option key={area.id} value={area.id}>
                                                            {area.name} ({area.code})
                                                            {area.district && ` - ${area.district}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={createForm.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
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
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Reason (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Maintenance, Emergency, etc."
                                                        className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                        {...field}
                                                    />
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
                                                <FormLabel className="font-semibold">Start Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
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
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">End Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createScheduleMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
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
            <Dialog
                open={!!editId}
                onOpenChange={(open) => !open && (setEditId(null), setEditSchedule(null))}
            >
                <DialogContent className="max-w-lg rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <EditIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Update Schedule</DialogTitle>
                        <DialogDescription>Modify the schedule details below.</DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={editForm.control}
                                    name="zoneId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Zone</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full h-11 border border-input bg-background rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                >
                                                    <option value="">Select a zone</option>
                                                    {areas.map((area: any) => (
                                                        <option key={area.id} value={area.id}>
                                                            {area.name} ({area.code})
                                                            {area.district && ` - ${area.district}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={editForm.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
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
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">
                                                    Reason (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Maintenance, Emergency, etc."
                                                        className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                        {...field}
                                                    />
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
                                                <FormLabel className="font-semibold">Start Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
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
                                        name="endTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">End Time</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        className="h-11 rounded-xl focus-visible:ring-amber-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditId(null);
                                        setEditSchedule(null);
                                    }}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateScheduleMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
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

            {/* Professional Delete Confirmation Dialog */}
            <Dialog
                open={Boolean(deleteConfirmId)}
                onOpenChange={(open) => !open && setDeleteConfirmId(null)}
            >
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="flex flex-col items-center text-center space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <AlertTriangleIcon className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Schedule?</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete this schedule? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={deleteScheduleMutation.isPending}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            disabled={deleteScheduleMutation.isPending}
                            className="flex-1 rounded-xl font-semibold"
                        >
                            {deleteScheduleMutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Yes, Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}