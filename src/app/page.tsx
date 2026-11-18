'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "@/components/Home";

const HomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const hasSession = Boolean(token && user);
        setIsAuthenticated(hasSession);

        if (!hasSession) {
            router.replace("/login");
        }
    }, [router]);

    if (isAuthenticated !== true) {
        return <div>Loading...</div>;
    }

    return <Home />;
};

export default HomePage;
