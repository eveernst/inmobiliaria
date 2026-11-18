"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserData, ROLE_LABELS, canManageUsers } from "@/lib/types";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const saved = localStorage.getItem("user");
      if (token && saved) setUser(JSON.parse(saved));
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setAuthResolved(true);
    }
  }, [pathname]); // se actualiza al cambiar de página

  // The root page redirects unauthenticated visitors to /login. Keep its
  // navbar hidden while that check runs and after it finds no session.
  if (pathname === "/" && (!authResolved || !user)) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const isSuperuser = canManageUsers(user?.role);

  return (
    <nav className="w-full border-b border-slate-700/60 bg-slate-900/95 backdrop-blur-sm py-3 sticky top-0 z-40">
      {/* Wraps on phones: three links plus the user menu don't fit in 375px (#70). */}
      <div className="page-container flex flex-wrap items-center justify-between gap-x-4 gap-y-2">

        {/* Logo / Título */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm group-hover:bg-orange-400 transition">
            A
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-200 hidden sm:block">
            Gestión AAC
          </span>
        </Link>

        {/* Links de navegación: la documentación se abre desde cada propiedad (#23).
            "Propiedades" vuelve (#70) para regresar al listado desde instalaciones.
            "Usuarios" es solo para superusuarios. */}
        {user && (
          <div className="order-last flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto">
            <Link
              href="/"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                pathname === "/" || pathname.startsWith("/property")
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              Propiedades
            </Link>
            <Link
              href="/installation"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                pathname.startsWith("/installation")
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              Instalaciones
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
