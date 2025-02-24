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
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white text-lg font-bold">Gestion Propiedades AAC</h1>
        <ul className="flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-white ${
                  pathname === link.href ? 'font-semibold' : 'font-normal'
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
