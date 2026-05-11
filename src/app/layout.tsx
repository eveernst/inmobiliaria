// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inmobiliaria",
  description: "Gestion de inmuebles AAC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen w-full flex-1">{children}</main>
      </body>
    </html>
  );
}
