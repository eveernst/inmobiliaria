// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Building2 } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Documentos', href: '/document-manager', icon: FileText },
    { name: 'Propiedad', href: '/property', icon: Building2 },

  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-2">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <h1 className="text-white text-2xl font-bold">AAC Inmobiliaria</h1>
          </div>

          <ul className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                        ? 'bg-white text-blue-600 font-semibold shadow-md'
                        : 'text-white hover:bg-blue-500 font-medium'
                      }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
