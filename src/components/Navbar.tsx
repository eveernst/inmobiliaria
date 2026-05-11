"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
// type NavbarProps = {
//   onLogout?: () => void;
// };

const Navbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

// const Navbar = ({ onLogout }: NavbarProps) => {
const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("token") && localStorage.getItem("user"));

const Navbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("token") && localStorage.getItem("user"));
>>>>>>> 8204bdfc8281730e2125a27e1140b03b98120cfe

  return (
    <nav className="w-full border-b border-slate-700/80 bg-gray-800/95 px-4 py-3">
      <div className="mx-0 flex w-full items-center justify-between gap-3">
        <h1 className="text-lg font-semibold tracking-wide text-white">Gestion Propiedades AAC</h1>
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-xl border-[0.5px] border-slate-500 bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600">
            Inicio
          </Link>
<<<<<<< HEAD

        {isAuthenticated && (
            <button onClick={handleLogout} className="rounded-xl border-[0.5px] border-slate-500 bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600">
=======
          {isAuthenticated && (
            <button onClick={handleLogout} className="rounded-lg border-[0.5px] border-slate-600 bg-slate-800/80 px-3 py-1 text-sm text-slate-200 hover:border-slate-500/60 hover:bg-slate-700/70">
>>>>>>> 8204bdfc8281730e2125a27e1140b03b98120cfe
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
