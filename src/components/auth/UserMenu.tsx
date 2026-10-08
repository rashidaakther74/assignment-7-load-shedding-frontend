"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FiUser, FiLayout } from "react-icons/fi";
import { useLogout } from "@/hook";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface User {
    name?: string;
    email?: string;
    role?: "ADMIN" | "OPERATOR" | "CONSUMER";
}

interface UserMenuProps {
    user: User;
}

const getDashboardRoute = (role?: string): string => {
    switch (role) {
        case "ADMIN":
            return "/admin";
        case "OPERATOR":
            return "/operator";
        case "CONSUMER":
            return "/consumer";
        default:
            return "/";
    }
};

export default function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: logout, isPending: logoutPending } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.add({
                    title: "User Logout Successfully",
                    description: "You have been logged out",
                    type: "success",
                });

                queryClient.removeQueries({ queryKey: ["user"] });
                router.push("/");
                router.refresh();
            },
            onError: (err: unknown) => {
                const message =
                    (err as { data?: { message?: string } })?.data?.message ||
                    (err as { message?: string })?.message ||
                    "Something went wrong, Please try again";

                toast.add({
                    title: "Logout Failed",
                    description: message,
                    type: "error",
                });
            },
        });
    };

    const dashboardRoute = getDashboardRoute(user.role);

    const handleDashboardClick = () => {
        router.push(dashboardRoute);
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "cursor-pointer"
                )}
            >
                <span className="flex items-center justify-center rounded-full text-foreground">
                    <FiUser className="h-4 w-4" />
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <span className="block truncate text-sm font-medium">
                        {user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                    {user.role && (
                        <span className="block truncate text-xs text-muted-foreground capitalize">
                            {user.role.toLowerCase()}
                        </span>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleDashboardClick}
                    className="cursor-pointer flex items-center gap-2"
                >
                    <FiLayout className="h-4 w-4" />
                    Dashboard
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={logoutPending}
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    {logoutPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}