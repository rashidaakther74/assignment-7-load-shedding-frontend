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
import { Eye, EyeClosed } from "lucide-react";
import { useRegistration } from "@/hook";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

import Link from "next/link";
import { registerSchema } from "@/validations";

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: register, isPending: registerPending } = useRegistration();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },

        validators: {
            onSubmit: registerSchema,
        },
        onSubmit: ({ value }) => {
            const registerData = {
                name: value.name.trim(),
                email: value.email.trim(),
                password: value.password,
            };
            register(registerData, {
                onSuccess: () => {
                    toast.add({
                        title: "User Registered Successfully",
                        description: "Please login to your new account",
                        type: "success",
                    });
                    router.push("/login");
                    router.refresh();
                },
                onError: (err: unknown) => {
                    const message =
                        (err as { data?: { message?: string } })?.data?.message ||
                        (err as { message?: string })?.message ||
                        "Something went wrong, Please try again";
                    toast.add({
                        title: "Registration failure",
                        description: message,
                        type: "error",
                    });
                },
            });
        },
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Create your account
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldGroup>
                    <form.Field name="name">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        value={field.state.value}
                                        autoComplete="name"
                                        aria-invalid={isInvalid}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>

                    <form.Field name="email">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        value={field.state.value}
                                        autoComplete="email"
                                        aria-invalid={isInvalid}
                                    />
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
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={showPassword ? "text" : "password"}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            value={field.state.value}
                                            autoComplete="new-password"
                                            aria-invalid={isInvalid}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
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

                    <Button disabled={registerPending} type="submit">
                        {registerPending ? (
                            <>
                                <Spinner /> Registering
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </FieldGroup>
            </form>
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                >
                    Login
                </Link>
            </div>
        </div>
    );
}
