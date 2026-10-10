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
import Logo from "@/utils/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MapPin,
    MessageSquareWarning,
    CreditCard,
    Users,
    CalendarClock,
    Zap,
    ShieldCheck
} from "lucide-react";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
    ADMIN: adminRoutes,
    CONSUMER: consumerRoutes,
    OPERATOR: operatorRoutes,
};

// মেনুর নামের সাথে মিল রেখে অটোমেটিক প্রফেশনাল আইকন দেখানোর ফাংশন
const getMenuIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("overview") || lower.includes("dashboard")) return <LayoutDashboard className="h-4 w-4" />;
    if (lower.includes("area") || lower.includes("zone")) return <MapPin className="h-4 w-4" />;
    if (lower.includes("complaint") || lower.includes("report")) return <MessageSquareWarning className="h-4 w-4" />;
    if (lower.includes("payment") || lower.includes("bill")) return <CreditCard className="h-4 w-4" />;
    if (lower.includes("user") || lower.includes("operator")) return <Users className="h-4 w-4" />;
    if (lower.includes("schedule") || lower.includes("outage")) return <CalendarClock className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
};

export function DashboardSidebar({ role }: { role: UserRole }) {
    const pathname = usePathname();
    const routes: SidebarItems = sidebarRoutes[role] || [];

   
    const filteredRoutes = routes
        .filter((group) => group.title.toLowerCase() !== "app settings")
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    !["routing", "data fetching"].includes(item.title.toLowerCase())
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar className="border-r border-border/60 bg-background/95 backdrop-blur-sm">
            {/* Top Brand Header */}
            <SidebarHeader className="border-b border-border/60 px-5 py-4">
                <div className="flex items-center justify-between">
                    <Logo />
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 w-fit border border-amber-500/20">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                    <span>{role} PORTAL</span>
                </div>
            </SidebarHeader>

            {/* Navigation Links */}
            <SidebarContent className="px-3 py-4">
                {filteredRoutes.map((group) => (
                    <SidebarGroup key={group.title} className="space-y-1">
                        <SidebarGroupLabel className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                render={<Link href={item.url} />}
                                                isActive={isActive}
                                                className={`h-10 px-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${isActive
                                                        ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20 shadow-sm"
                                                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                                                    }`}
                                            >
                                                <span className={isActive ? "text-amber-500" : "text-muted-foreground"}>
                                                    {getMenuIcon(item.title)}
                                                </span>
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}