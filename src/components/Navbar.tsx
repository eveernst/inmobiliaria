// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Gestor de Documentos', href: '/document-manager' },
    { name: 'Propiedad', href: '/property' },
    { name: 'Inicio', href: '/' },

  ];

  return (
    <nav className="bg-gray-800/95 px-4 py-3 border-b border-[0.5px] border-slate-700/80">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-lg font-semibold tracking-wide">Gestion Propiedades AAC</h1>
        <ul className="flex items-center rounded-2xl border-[0.5px] border-slate-600 bg-slate-800/80 p-1 shadow-inner">
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              {link.href !== navLinks[0].href && (
                <span className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-slate-600/70" />
              )}
              <Link
                href={link.href}
                className={`mx-1 block rounded-xl px-4 py-2 text-sm transition ${
                  pathname === link.href
                    ? 'border-[0.5px] border-slate-300/40 bg-slate-700 text-white font-semibold shadow-sm'
                    : 'border-[0.5px] border-transparent text-slate-200 hover:border-slate-500/60 hover:bg-slate-700/70'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
