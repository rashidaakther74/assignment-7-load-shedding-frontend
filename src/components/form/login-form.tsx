"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";

import { useState } from "react";
import { Eye, EyeClosed, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import { useLogin } from "@/hook";
import { getMe } from "@/api";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

import Link from "next/link";
import { loginSchema } from "@/validations";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: login, isPending: loginPending } = useLogin();
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },

        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password,
            };
            login(loginData, {
                onSuccess: async (res: any) => {
                    toast.add({
                        title: "User Login Successfully",
                        description: "Redirecting to your dashboard...",
                        type: "success",
                    });

                    // আগে queryClient রিফ্রেশ না করে সরাসরি ইউজারের Role চেক করব,
                    // যাতে Auth Layout বা Login Page মাঝখান থেকে "/" এ পাঠাতে না পারে!
                    let role =
                        res?.data?.user?.role ||
                        res?.data?.role ||
                        res?.user?.role ||
                        res?.role;

                    if (!role) {
                        try {
                            const meRes: any = await getMe();
                            role =
                                meRes?.data?.role ||
                                meRes?.data?.user?.role ||
                                meRes?.user?.role ||
                                meRes?.role;
                        } catch {
                            // ignore error
                        }
                    }

                    const normalizedRole = String(role || "").toUpperCase();

                    if (normalizedRole === "ADMIN") {
                        window.location.replace("/admin");
                    } else if (normalizedRole === "OPERATOR") {
                        window.location.replace("/operator");
                    } else {
                        window.location.replace("/consumer");
                    }
                },
                onError: (err: unknown) => {
                    const message =
                        (err as { data?: { message?: string } })?.data?.message ||
                        (err as { message?: string })?.message ||
                        "Something went wrong, Please try again";
                    toast.add({
                        title: "Authorization failure",
                        description: message,
                        type: "error",
                    });
                },
            });
        },
    });

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-2.5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
                    <Zap className="h-6 w-6 fill-amber-500/20" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Login to your account
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to access your dashboard
                </p>
            </div>

            {/* Form Section */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldGroup className="space-y-4">
                    <form.Field name="email">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid} className="space-y-1.5">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold">
                                        Email Address
                                    </FieldLabel>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            placeholder="name@example.com"
                                            className="pl-10 h-11 rounded-xl bg-background/60 focus-visible:ring-amber-500"
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            value={field.state.value}
                                            autoComplete="off"
                                            aria-invalid={isInvalid}
                                        />
                                    </div>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid} className="space-y-1.5">
                                    <FieldLabel htmlFor={field.name} className="text-sm font-semibold">
                                        Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-11 rounded-xl bg-background/60 focus-visible:ring-amber-500"
                                            type={showPassword ? "text" : "password"}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            value={field.state.value}
                                            autoComplete="off"
                                            aria-invalid={isInvalid}
                                        />
                                        <button
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <EyeClosed className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <Button
                        disabled={loginPending}
                        type="submit"
                        className="w-full h-11 mt-2 rounded-xl font-semibold text-white shadow-md shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-0 transition-all"
                    >
                        {loginPending ? (
                            <>
                                <Spinner /> Logging in...
                            </>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Login <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </FieldGroup>
            </form>

            {/* Footer Link */}
            <div className="border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-amber-500 underline-offset-4 hover:underline"
                >
                    Create an account
                </Link>
            </div>
        </div>
    );
}