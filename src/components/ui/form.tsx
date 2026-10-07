"use client";

import * as React from "react";
import * as Slot from "@radix-ui/react-slot";
import { Controller, ControllerProps, ControllerFieldState, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "cn";
import { Label } from "@/components/ui/label";

interface FormFieldContextProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    fieldState: ControllerFieldState;
}

const FormFieldContext = React.createContext<FormFieldContextProps<FieldValues> | null>(null);

function FormFieldInternal<TFieldValues extends FieldValues>({
    control,
    ...props
}: ControllerProps<TFieldValues>) {
    return (
        <Controller
            control={control}
            {...props}
            render={({ field, fieldState, formState }) => (
                <FormFieldContext.Provider value={{ name: props.name, fieldState }}>
                    {props.render({ field, fieldState, formState })}
                </FormFieldContext.Provider>
            )}
        />
    );
}

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext);
    const formContext = useFormContext();

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { name, fieldState } = fieldContext;
    const { formState, ...form } = formContext;

    return {
        ...form,
        name,
        fieldState,
    };
}

interface FormFieldProps<TFieldValues extends FieldValues>
    extends Omit<ControllerProps<TFieldValues>, "control"> {
    control?: ReturnType<typeof import("react-hook-form").useForm<TFieldValues>>["control"];
}

export function FormField<TFieldValues extends FieldValues>({
    ...props
}: FormFieldProps<TFieldValues>) {
    return <FormFieldInternal<TFieldValues> {...props} />;
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
    )
);
FormItem.displayName = "FormItem";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
    ({ className, ...props }, ref) => {
        const { name, fieldState } = useFormField();
        return (
            <Label
                ref={ref}
                className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
                htmlFor={name}
                {...props}
            />
        );
    }
);
FormLabel.displayName = "FormLabel";

interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot.Slot> {}

export const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot.Slot>,
    FormControlProps
>(({ className, ...props }, ref) => {
    const { name, fieldState } = useFormField();
    return (
        <Slot.Slot
            ref={ref}
            id={name}
            className={cn("focus:border-ring focus:ring-2 focus:ring-ring/20", className)}
            {...props}
        />
    );
});
FormControl.displayName = "FormControl";

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
    ({ className, ...props }, ref) => {
        const { name, fieldState } = useFormField();
        return (
            <p
                ref={ref}
                id={`${name}-description`}
                className={cn("text-sm text-muted-foreground", className)}
                {...props}
            />
        );
    }
);
FormDescription.displayName = "FormDescription";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
    ({ className, children, ...props }, ref) => {
        const { fieldState } = useFormField();
        if (!fieldState.error) return null;

        return (
            <p
                ref={ref}
                id={`${name}-message`}
                className={cn("text-sm font-medium text-destructive", className)}
                {...props}
            >
                {children || String(fieldState.error?.message || "")}
            </p>
        );
    }
);
FormMessage.displayName = "FormMessage";

export { useFormField };