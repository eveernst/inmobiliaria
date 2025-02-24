"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function LoginScreen() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="w-full max-w-md">
        <Card className="w-full bg-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Inicio Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-slate-300">
              El sistema de sesiones está integrado con las credenciales
              institucionales de:
            </p>
            <div className="flex justify-center">
              <Image
                src="/images/office365-logo.png"
                alt="Office 365 Logo"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
            <p className="text-xs text-center text-slate-400">
              Para esto deberás acceder con tu cuenta
              nombre.apellido@adventista.org.ar y tu contraseña
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
