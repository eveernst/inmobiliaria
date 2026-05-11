'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showNavbar = pathname !== "/login";

    return (
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#0f172a_45%,_#020617_100%)] text-slate-100">
            {showNavbar && <Navbar />}
            <main className="flex-1">{children}</main>
        </div>
    );
}