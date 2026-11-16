"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/api";

const INVALID_CREDENTIALS = "Correo electrónico o contraseña incorrectos";

const loginErrorMessage = (err: unknown): string => {
  if (!axios.isAxiosError(err)) return "No se pudo iniciar sesión.";
  if (!err.response) return "No se pudo conectar con el servidor.";
  if (err.response.status === 401) return INVALID_CREDENTIALS;
  return "No se pudo iniciar sesión.";
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Shared client: same base URL as every other API call (#53).
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirigir a la página principal
      router.push("/");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Sistema Inmuebles <span className="text-orange-500">AAC</span>
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-orange-500" />
          <p className="mt-3 text-sm text-gray-400">
            Gestión de propiedades y documentación
          </p>
        </div>
        <Card className="w-full bg-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Inicio de Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 text-white border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 text-white border-gray-600"
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
