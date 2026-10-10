"use client";

import {
    PlusIcon,
    Loader2Icon,
    AlertCircleIcon,
    ClockIcon,
    CheckCircleIcon,
    Trash2Icon,
    AlertTriangleIcon,
    CalendarIcon,
    MessageSquareWarningIcon,
    SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
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
import { useCreateComplaint, useGetMyComplaints, useDeleteMyComplaint } from "@/hook";
import { toast } from "@/hook/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const complaintSchema = z.object({
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

const statusColors = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

const statusBorderColors = {
    PENDING: "border-l-amber-500",
    IN_PROGRESS: "border-l-blue-500",
    RESOLVED: "border-l-emerald-500",
};

const statusIcons = {
    PENDING: ClockIcon,
    IN_PROGRESS: Loader2Icon,
    RESOLVED: CheckCircleIcon,
};

export default function ConsumerComplaintsPage() {
    const createComplaintMutation = useCreateComplaint();
    const deleteMyComplaintMutation = useDeleteMyComplaint();
    const { data: myComplaints, isLoading: isLoadingComplaints } = useGetMyComplaints();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const createForm = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSchema),
        defaultValues: { subject: "", description: "" },
    });

    const onCreateSubmit = async (data: ComplaintFormData) => {
        try {
            await createComplaintMutation.mutateAsync(data);
            toast({ title: "Success", description: "Complaint submitted successfully" });
            createForm.reset();
            setIsDialogOpen(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit complaint",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMyComplaintMutation.mutateAsync(id);
            toast({ title: "Success", description: "Complaint deleted successfully" });
            setDeleteConfirmId(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete complaint",
            });
            setDeleteConfirmId(null);
        }
    };

    const openDialog = () => {
        createForm.reset({ subject: "", description: "" });
        setIsDialogOpen(true);
    };

    const complaintsList = myComplaints?.data || [];

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-[85vh]">
            {/* Top Header Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <MessageSquareWarningIcon className="h-3.5 w-3.5" />
                            <span>Support & Outage Reports</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            My Complaints
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Report power outages or grid issues in your area and track resolution status.
                        </p>
                    </div>

                    <Button
                        onClick={openDialog}
                        className="h-11 px-6 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 transition-all hover:scale-[1.02] shrink-0"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Submit Complaint
                    </Button>
                </div>
            </div>

            {/* Create Complaint Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg rounded-2xl border-border/80 p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <SparklesIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Submit New Complaint</DialogTitle>
                        <DialogDescription className="text-sm">
                            Fill in the details below regarding the power cut or electrical issue in your zone.
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...createForm}>
                        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={createForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Subject</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Frequent unscheduled power cuts in Zone B"
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide detailed information about the outage or transformer issue..."
                                                    className="min-h-[130px] rounded-xl focus-visible:ring-amber-500 resize-none"
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
                                    onClick={() => setIsDialogOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createComplaintMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
                                    {createComplaintMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Complaint"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Professional Delete Confirmation Modal */}
            <Dialog
                open={Boolean(deleteConfirmId)}
                onOpenChange={(open) => {
                    if (!open) setDeleteConfirmId(null);
                }}
            >
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="flex flex-col items-center text-center space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <AlertTriangleIcon className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Complaint?</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete this complaint? This action cannot be undone and will permanently remove it from your records.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={deleteMyComplaintMutation.isPending}
                            className="flex-1 rounded-xl"
                        >
                            No, Keep It
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            disabled={deleteMyComplaintMutation.isPending}
                            className="flex-1 rounded-xl font-semibold"
                        >
                            {deleteMyComplaintMutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2Icon className="mr-2 h-4 w-4" />
                                    Yes, Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* My Complaints List Card */}
            <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/20 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg font-bold">Submitted Complaints</CardTitle>
                        <CardDescription>
                            Track the real-time resolution status of your submitted reports
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="w-fit px-3 py-1 text-xs font-semibold">
                        Total: {complaintsList.length}
                    </Badge>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoadingComplaints ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2Icon className="h-8 w-8 animate-spin text-amber-500" />
                            <p className="text-sm text-muted-foreground">Loading your complaints...</p>
                        </div>
                    ) : complaintsList.length > 0 ? (
                        <div className="space-y-4">
                            {complaintsList.map((complaint) => {
                                const StatusIcon =
                                    statusIcons[complaint.status as keyof typeof statusIcons] || ClockIcon;
                                const borderColor =
                                    statusBorderColors[complaint.status as keyof typeof statusBorderColors] ||
                                    "border-l-amber-500";

                                return (
                                    <Card
                                        key={complaint.id}
                                        className={`rounded-xl border border-l-4 ${borderColor} bg-card/60 hover:bg-muted/20 transition-all shadow-sm`}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1 space-y-2.5">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                                                            {complaint.subject}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[
                                                                complaint.status as keyof typeof statusColors
                                                                ] || ""
                                                                }`}
                                                        >
                                                            <StatusIcon className="mr-1.5 h-3 w-3" />
                                                            {complaint.status.replace("_", " ")}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {complaint.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarIcon className="h-3.5 w-3.5 text-amber-500" />
                                                            Submitted:{" "}
                                                            <strong className="text-foreground font-medium">
                                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                                            </strong>
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                            Last Updated:{" "}
                                                            <strong className="text-foreground font-medium">
                                                                {new Date(complaint.updatedAt).toLocaleDateString()}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-2 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDeleteConfirmId(complaint.id)}
                                                        className="h-9 px-3 rounded-lg border-red-500/20 text-red-600 hover:text-red-700 hover:bg-red-500/10 gap-1.5"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                        <span className="text-xs font-medium">Delete</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-14 px-4 rounded-xl border border-dashed bg-muted/10">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                                <AlertCircleIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">No Complaints Yet</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                                You haven&apos;t submitted any complaints yet. Click the button below to report your first power outage or grid issue.
                            </p>
                            <Button
                                onClick={openDialog}
                                className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Submit Complaint
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}