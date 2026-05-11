import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
<<<<<<< HEAD
import AppShell from "../components/AppShell";
=======
import AppShell from "@/components/AppShell";
>>>>>>> 8204bdfc8281730e2125a27e1140b03b98120cfe

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
<<<<<<< HEAD
        <AppShell>
          {/* <main className="min-h-screen w-full flex-1">{children}</main> */}
          {children}
        </AppShell>
=======
        <AppShell>{children}</AppShell>
>>>>>>> 8204bdfc8281730e2125a27e1140b03b98120cfe
      </body>
    </html>
  );
}
