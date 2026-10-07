"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "cn"

import { Separator } from "@/components/ui/separator"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.Trigger.Props & { asChild?: boolean; children?: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { asChild, ...restProps } = props;
  return (
    <MenuPrimitive.Trigger
      // @ts-ignore - asChild is supported by the component but not in types
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      asChild={asChild}
      {...(restProps as any)}
    >
      {children}
    </MenuPrimitive.Trigger>
  )
}

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50 outline-hidden"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  children,
  ...props
}: MenuPrimitive.Item.Props & { children?: React.ReactNode }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Item>
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-sm font-medium", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={cn("mx-2 my-1", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
