"use client";

import { PlusIcon, Loader2Icon } from "lucide-react";
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
import { useCreateComplaint } from "@/hook";
import { toast } from "@/hook/use-toast";
import { useState } from "react";

const complaintSchema = z.object({
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function ConsumerComplaintsPage() {
    const createComplaintMutation = useCreateComplaint();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const openDialog = () => {
        createForm.reset({ subject: "", description: "" });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submit Complaint</h1>
                    <p className="text-muted-foreground">Submit a new complaint for our team to review</p>
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

            {/* Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Complaint Submitted</h3>
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                            Your complaint has been submitted successfully. Our team will review it and get back to you soon.
                            You can check the status of your complaint by contacting support.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}