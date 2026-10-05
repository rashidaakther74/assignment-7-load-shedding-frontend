import { z } from "zod";

export const loginSchema = z.object({

    email: z.email("Please enter a valid email address"),
    password: z
        .string("Password does not match")

});

export type LoginFormValues = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
