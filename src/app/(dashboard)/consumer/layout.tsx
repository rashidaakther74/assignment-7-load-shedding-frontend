
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function ConsumerLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard roles={["CONSUMER",]}>
            <DashboardShell role="CONSUMER">{children}</DashboardShell>
        </RoleGuard>
    );
}
