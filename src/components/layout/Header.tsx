"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe, useLogout } from "@/hook";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { FiUser } from "react-icons/fi";

export default function Header() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data, isPending } = useGetMe();
    const { mutate: logout, isPending: logoutPending } = useLogout();

    const user = data?.data;

    const routes = [
        { name: "Home", url: "/" },
        { name: "Areas", url: "/areas" },
    ];

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

    return (
        <header className="h-16 w-full shrink-0 border-b">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        Load-Shedding
                    </Link>

                    <nav className="hidden gap-5 text-sm text-muted-foreground md:flex">
                        {routes.map((route) => (
                            <Link
                                key={route.url}
                                href={route.url}
                                className="transition-colors hover:text-foreground"
                            >
                                {route.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {isPending ? (
                        <Spinner className="text-muted-foreground" />
                    ) : user ? (
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
                                </DropdownMenuLabel>

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
                    ) : (
                        <Link
                            href="/login"
                            className={buttonVariants({ variant: "default" })}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}