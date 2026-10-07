import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

export default function OperatorLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard roles={["OPERATOR",]}>
            <DashboardShell role="OPERATOR">{children}</DashboardShell>
        </RoleGuard>
    );
}