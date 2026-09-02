"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserData, ROLE_LABELS } from "@/lib/types";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const saved = localStorage.getItem("user");
      if (token && saved) setUser(JSON.parse(saved));
    } catch { /* sin sesión */ }
  }, [pathname]); // se actualiza al cambiar de página

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const isAdmin = user?.role === 1 || user?.role === 3;
  const isSuperuser = user?.role === 3;

  return (
    <nav className="w-full border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm px-4 py-3 sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

        {/* Logo / Título */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm group-hover:bg-orange-400 transition">
            A
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-200 hidden sm:block">
            Gestión AAC
          </span>
        </Link>

        {/* Links de navegación */}
        {user && (
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                pathname === "/"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              Propiedades
            </Link>

            <Link
              href="/document-manager"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                pathname === "/document-manager"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              Documentos
            </Link>

            {isSuperuser && (
              <Link
                href="/user"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pathname === "/user"
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                Usuarios
              </Link>
            )}
          </div>
        )}

        {/* Usuario + logout */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-700"
              >
                {/* Avatar */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-[120px] truncate">{user.name}</span>
                <span className="hidden sm:block text-xs text-slate-400">
                  ({ROLE_LABELS[user.role] ?? "—"})
                </span>
                <svg className={`h-4 w-4 text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl py-1 z-50">
                  <div className="border-b border-slate-800 px-4 py-2">
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <p className="text-xs font-semibold text-orange-400 mt-0.5">
                      {ROLE_LABELS[user.role] ?? "—"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* Cerrar dropdown al hacer click afuera */}
      {menuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
