// components/Navbar.tsx
"use client";

import Link from "next/link";

type NavbarProps = {
  onLogout?: () => void;
};

const Navbar = ({ onLogout }: NavbarProps) => {

  return (
    <nav className="bg-gray-800/95 px-4 py-3 border-b border-[0.5px] border-slate-700/80">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <h1 className="text-white text-lg font-semibold tracking-wide">Gestion Propiedades AAC</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-xl border-[0.5px] border-slate-500 bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600" >
            Inicio
          </Link>
        {onLogout && (
          <button
          onClick={onLogout}
          className="rounded-lg border-[0.5px] border-slate-600 bg-slate-800/80 px-3 py-1 text-sm text-slate-200 hover:border-slate-500/60 hover:bg-slate-700/70"
          >
            Cerrar Sesión
          </button>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
