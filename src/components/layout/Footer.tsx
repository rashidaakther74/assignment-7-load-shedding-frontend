import Logo from "@/utils/Logo";
import Link from "next/link";

export default function Footer() {
    const navigation = {
        quickLinks: [
            { name: "Home", href: "/" },
            { name: "Areas", href: "/areas" },
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
        ],
        support: [
            { name: "Help Center", href: "/contact" },
            { name: "Report Outage", href: "/areas" },
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
        ],
    };

    return (
        <footer className="mt-auto border-t bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand info */}
                    <div className="md:col-span-2 space-y-4">
                        <Logo />
                        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                            Real-time load shedding schedule tracker and notifications for your neighborhood. Stay prepared and plan your day without unexpected power cuts.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
                        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                            {navigation.quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="transition-colors hover:text-foreground">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Help & Support</h3>
                        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                            {navigation.support.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="transition-colors hover:text-foreground">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} LoadShedding Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}