import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            <Header />
            <div>{children}</div>
            <Footer />
        </main>
    );
}
