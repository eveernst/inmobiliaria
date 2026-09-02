'use client';

import { useEffect, useState } from "react";
import Home from "@/components/Home";
import LoginScreen from "@/components/Login";

const HomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        setIsAuthenticated(Boolean(token && user));
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    return <Home />;
};

export default HomePage;