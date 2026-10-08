"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetMe } from "@/hook";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import UserMenu from "../auth/UserMenu";
import Logo from "@/utils/Logo";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isPending } = useGetMe();
    const user = data?.data;

    const routes = [
        { name: "Home", url: "/" },
        { name: "Areas", url: "/areas" },
        { name: "About Us", url: "/about" },
        { name: "Contact", url: "/contact" },
    ];

    return (
        <header className="h-16 w-full shrink-0 border-b bg-background">
            <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
                {/* 1. Left: Mobile Hamburger & Logo */}
                <div className="flex items-center gap-2">
                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            {/* Nested button এড়াতে সরাসরি buttonVariants স্টাইল ব্যবহার করা হয়েছে */}
                            <SheetTrigger
                                className={buttonVariants({ variant: "ghost", size: "icon" })}
                                aria-label="Open Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-6">
                                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                <div className="mb-6">
                                    <Logo />
                                </div>
                                <nav className="flex flex-col gap-4">
                                    {routes.map((route) => (
                                        <Link
                                            key={route.url}
                                            href={route.url}
                                            onClick={() => setIsOpen(false)}
                                            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {route.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Logo />
                </div>

                {/* 2. Center: Desktop Navigation */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm text-muted-foreground md:flex">
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

                {/* 3. Right: Auth / User Menu */}
                <div className="flex items-center gap-3">
                    {isPending ? (
                        <Spinner className="text-muted-foreground" />
                    ) : user ? (
                        <UserMenu user={user} />
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