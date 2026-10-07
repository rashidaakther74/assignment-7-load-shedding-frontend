"use client";

import { useState } from "react";
import {
    SearchIcon,
    Loader2Icon,
    CircleAlert,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    EditIcon,
    Trash2Icon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useGetComplaints, useUpdateComplaint, useDeleteComplaint } from "@/hook";
import { toast } from "@/hook/use-toast";
import type { Complaint, ComplaintStatus } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
        default: "bg-muted text-muted-foreground",
        warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        info: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminComplaintsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editComplaint, setEditComplaint] = useState<Complaint | null>(null);

    const { data: complaintsResponse, isLoading, error } = useGetComplaints();
    const updateComplaintMutation = useUpdateComplaint();
    const deleteComplaintMutation = useDeleteComplaint();

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
            toast({ title: "Success", description: "Complaint updated successfully" });
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

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteComplaintMutation.mutateAsync(deleteId);
            toast({ title: "Success", description: "Complaint deleted successfully" });
            setDeleteId(null);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete complaint",
            });
        }
    };

    const handleEditClick = (complaint: Complaint) => {
        setEditComplaint(complaint);
        setEditId(complaint.id);
        editForm.reset({ status: complaint.status });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Complaints</h1>
                    <p className="text-muted-foreground">Manage and track all user complaints</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-80">
                    <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by subject, description, user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | "all")}
                        className="w-full appearance-none pl-9 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                        <option value="all">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                    </select>
                    <CircleAlert className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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

            {/* Complaints Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2Icon className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-destructive">
                                    Failed to load complaints
                                </TableCell>
                            </TableRow>
                        ) : filteredComplaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No complaints found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredComplaints.map((complaint: Complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {complaint.subject}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{complaint.user?.name || "Unknown"}</p>
                                            <p className="text-sm text-muted-foreground">{complaint.user?.email || "N/A"}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusConfig[complaint.status].variant} className="gap-1">
                                            {statusConfig[complaint.status].icon}
                                            {statusConfig[complaint.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                className={cn(
                                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                                    "text-muted-foreground hover:text-foreground cursor-pointer"
                                                )}
                                                aria-label="Actions"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2"
                                                    onClick={() => handleEditClick(complaint)}
                                                    disabled={updateComplaintMutation.isPending}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                    Update Status
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                                    onClick={() => setDeleteId(complaint.id)}
                                                    disabled={deleteComplaintMutation.isPending}
                                                >
                                                    <Trash2Icon className="h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Status Dialog */}
            <Dialog
                open={!!editId}
                onOpenChange={(open) => !open && (setEditId(null), setEditComplaint(null))}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Complaint Status</DialogTitle>
                        <DialogDescription>
                            Update the status for: {editComplaint?.subject}
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={editForm.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                            <DialogFooter>
                                <Button type="submit" disabled={updateComplaintMutation.isPending}>
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Complaint</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this complaint? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteComplaintMutation.isPending}
                        >
                            {deleteComplaintMutation.isPending ? (
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