"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, consumerRoutes, operatorRoutes } from "@/routes";


import { SidebarItems, UserRole } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
    ADMIN: adminRoutes,
    CONSUMER: consumerRoutes,
    OPERATOR: operatorRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
    const pathname = usePathname();
    const routes: SidebarItems = sidebarRoutes[role] || [];

    console.log(pathname);

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/">
                    <div className="flex items-center gap-2">
                        {/* <Logo /> */}
                        <span>PH Healthcare</span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {routes.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            render={<Link href={item.url} />}
                                            isActive={pathname === item.url}
                                        >
                                            {item.title}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
