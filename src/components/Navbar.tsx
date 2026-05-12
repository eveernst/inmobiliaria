// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

const Navbar = () => {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("token") && localStorage.getItem("user"));
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsAuthenticated(Boolean(token && user));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="w-full border-b border-slate-700/80 bg-gray-800/95 px-4 py-3">
      <div className="mx-0 flex w-full items-center justify-between gap-3">
        <h1 className="text-lg font-semibold tracking-wide text-white">Gestion Propiedades AAC</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-xl border-[0.5px] border-slate-500 bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600">
            Inicio
          </Link>

          {isAuthenticated && (
            <button onClick={handleLogout} className="rounded-xl border-[0.5px] border-slate-500 bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600">
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
