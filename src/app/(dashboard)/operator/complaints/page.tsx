"use client";

import { useState } from "react";
import {
    SearchIcon,
    Loader2Icon,
    CircleAlert,
    CheckCircle,
    Clock,
    AlertCircle,
    EditIcon,
    EyeIcon,
    EyeOffIcon,
    MessageSquareWarningIcon,
    UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetComplaints, useUpdateComplaint } from "@/hook";
import { toast } from "@/hook/use-toast";
import type { Complaint, ComplaintStatus } from "@/types";

const updateComplaintSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});

type UpdateComplaintFormData = z.infer<typeof updateComplaintSchema>;

const statusConfig: Record<
    ComplaintStatus,
    {
        label: string;
        variant: "default" | "secondary" | "outline" | "muted" | "success" | "warning" | "destructive" | "info";
        icon: React.ReactNode;
    }
> = {
    PENDING: { label: "Pending", variant: "warning", icon: <Clock className="h-3 w-3" /> },
    IN_PROGRESS: { label: "In Progress", variant: "info", icon: <AlertCircle className="h-3 w-3" /> },
    RESOLVED: { label: "Resolved", variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
};

export default function OperatorComplaintsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
    const [editId, setEditId] = useState<string | null>(null);
    const [editComplaint, setEditComplaint] = useState<Complaint | null>(null);
    // শুরুতে false রাখা হয়েছে যাতে পেইজে ঢুকলেই নিচে লিস্ট না দেখায়, বাটনে ক্লিক করলেই কেবল দেখাবে!
    const [showAllComplaints, setShowAllComplaints] = useState(false);

    const { data: complaintsResponse, isLoading, error } = useGetComplaints();
    const updateComplaintMutation = useUpdateComplaint();

    const complaints: Complaint[] = complaintsResponse?.data || [];

    const filteredComplaints = complaints.filter((complaint: Complaint) => {
        const matchesSearch =
            complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (complaint.user && complaint.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (complaint.user && complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const editForm = useForm<UpdateComplaintFormData>({
        resolver: zodResolver(updateComplaintSchema),
        defaultValues: { status: "PENDING" },
    });

    const onEditSubmit = async (data: UpdateComplaintFormData) => {
        if (!editId) return;
        try {
            await updateComplaintMutation.mutateAsync({ id: editId, payload: data });
            toast({ title: "Success", description: "Complaint status updated successfully" });
            setEditId(null);
            setEditComplaint(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update complaint",
            });
        }
    };

    const handleEditClick = (complaint: Complaint) => {
        setEditComplaint(complaint);
        setEditId(complaint.id);
        editForm.reset({ status: complaint.status });
    };

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-[85vh]">
            {/* Top Portal Header */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <MessageSquareWarningIcon className="h-3.5 w-3.5" />
                            <span>Operator Support Desk</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Complaints Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor outage complaint summaries and click below to view and update statuses.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total" value={complaints.length} icon={CircleAlert} variant="default" />
                <StatCard
                    title="Pending"
                    value={complaints.filter((c) => c.status === "PENDING").length}
                    icon={Clock}
                    variant="warning"
                />
                <StatCard
                    title="In Progress"
                    value={complaints.filter((c) => c.status === "IN_PROGRESS").length}
                    icon={AlertCircle}
                    variant="info"
                />
                <StatCard
                    title="Resolved"
                    value={complaints.filter((c) => c.status === "RESOLVED").length}
                    icon={CheckCircle}
                    variant="success"
                />
            </div>

            {/* Action Bar: Toggle "Get All Complaints" */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                    type="button"
                    onClick={() => setShowAllComplaints((prev) => !prev)}
                    variant={showAllComplaints ? "default" : "outline"}
                    className={`h-12 px-6 rounded-xl font-semibold transition-all ${showAllComplaints
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-0"
                            : "border-amber-500/30 hover:bg-amber-500/10 text-foreground"
                        }`}
                >
                    {showAllComplaints ? (
                        <>
                            <EyeOffIcon className="mr-2 h-4 w-4" />
                            Hide All Complaints
                        </>
                    ) : (
                        <>
                            <EyeIcon className="mr-2 h-4 w-4 text-amber-500" />
                            Get All Complaints ({complaints.length})
                        </>
                    )}
                </Button>
            </div>

            {/* Complaints Table — শুধুমাত্র "Get All Complaints" বাটনে ক্লিক করলেই নিচে দেখাবে */}
            {showAllComplaints && (
                <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardHeader className="border-b bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold">All User Complaints</CardTitle>
                            <CardDescription>
                                Search and update resolution statuses for submitted complaints
                            </CardDescription>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-72">
                                <SearchIcon className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by subject, user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-background focus-visible:ring-amber-500"
                                />
                            </div>
                            <div className="relative w-full sm:w-44">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | "all")}
                                    className="w-full h-10 appearance-none pl-9 pr-8 border border-input bg-background rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                                <CircleAlert className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="pl-6 font-bold">Subject</TableHead>
                                    <TableHead className="font-bold">User</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Created</TableHead>
                                    <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <Loader2Icon className="mx-auto h-7 w-7 animate-spin text-amber-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-destructive font-medium">
                                            Failed to load complaints
                                        </TableCell>
                                    </TableRow>
                                ) : filteredComplaints.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            No complaints found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredComplaints.map((complaint: Complaint) => (
                                        <TableRow key={complaint.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell className="pl-6 font-semibold max-w-[300px]">
                                                <p className="truncate text-foreground">{complaint.subject}</p>
                                                <p className="text-xs text-muted-foreground font-normal truncate mt-0.5">
                                                    {complaint.description}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                                                        <UserIcon className="h-4 w-4" />
                                                    </span>
                                                    <div>
                                                        <p className="font-semibold text-sm text-foreground">
                                                            {complaint.user?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {complaint.user?.email || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusConfig[complaint.status].variant} className="gap-1">
                                                    {statusConfig[complaint.status].icon}
                                                    {statusConfig[complaint.status].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(complaint.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(complaint)}
                                                    disabled={updateComplaintMutation.isPending}
                                                    className="h-8 px-3 rounded-lg border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5"
                                                >
                                                    <EditIcon className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-semibold">Update</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Edit Status Dialog */}
            <Dialog open={!!editId} onOpenChange={(open) => !open && (setEditId(null), setEditComplaint(null))}>
                <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                            <EditIcon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Update Complaint Status</DialogTitle>
                        <DialogDescription>
                            Update the status for:{" "}
                            <strong className="text-foreground">{editComplaint?.subject}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-2">
                                <FormField
                                    control={editForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Status</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full h-11 border border-input bg-background rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                </select>
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
                                    onClick={() => {
                                        setEditId(null);
                                        setEditComplaint(null);
                                    }}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateComplaintMutation.isPending}
                                    className="rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0"
                                >
                                    {updateComplaintMutation.isPending ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Status"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    variant,
}: {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    variant: "default" | "warning" | "info" | "success";
}) {
    const variantClasses = {
        default: "bg-amber-500/10 text-amber-500",
        warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        info: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    };

    return (
        <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-3xl font-extrabold text-foreground mt-1">{value}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${variantClasses[variant]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateString;
    }
}