"use client";

import { PlusIcon, Loader2Icon, AlertCircleIcon, ClockIcon, CheckCircleIcon, Trash2Icon, AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Complaints</h1>
                    <p className="text-muted-foreground">View and submit complaints</p>
                </div>

                <Button onClick={openDialog}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Submit Complaint
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Submit New Complaint</DialogTitle>
                            <DialogDescription>Fill in the details below to submit a complaint.</DialogDescription>
                        </DialogHeader>
                        <FormProvider {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={createForm.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Brief summary of the issue" {...field} />
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Detailed description of the issue" className="min-h-[120px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createComplaintMutation.isPending}>
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
            </div>

            {/* My Complaints List */}
            <Card>
                <CardHeader>
                    <CardTitle>My Complaints</CardTitle>
                    <CardDescription>Track the status of your submitted complaints</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingComplaints ? (
                        <div className="flex justify-center py-8">
                            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : myComplaints?.data && myComplaints.data.length > 0 ? (
                        <div className="space-y-4">
                            {myComplaints.data.map((complaint) => {
                                const StatusIcon = statusIcons[complaint.status as keyof typeof statusIcons] || ClockIcon;
                                const isDeleting = deleteMyComplaintMutation.isPending && deleteConfirmId === complaint.id;
                                return (
                                    <Card key={complaint.id} className="border-l-4 border-primary">
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-medium">{complaint.subject}</h3>
                                                        <Badge className={statusColors[complaint.status as keyof typeof statusColors] || ""}>
                                                            <StatusIcon className="mr-1 h-3 w-3" />
                                                            {complaint.status.replace("_", " ")}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground mb-3">{complaint.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                                                        <span>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {deleteConfirmId === complaint.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-muted-foreground">Delete?</span>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(complaint.id)}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting ? (
                                                                    <Loader2Icon className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2Icon className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setDeleteConfirmId(null)}
                                                                disabled={isDeleting}
                                                            >
                                                                <AlertTriangleIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeleteConfirmId(complaint.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <AlertCircleIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Complaints Yet</h3>
                            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                You haven't submitted any complaints yet. Click "Submit Complaint" to create your first one.
                            </p>
                            <Button onClick={openDialog}>
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