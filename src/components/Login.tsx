"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

const TEST_USERS = [
  { email: "admin@test.com", password: "admin123", role: "Admin" },
  { email: "viewer@test.com", password: "admin123", role: "Viewer" },
];

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
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
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onLoginSuccess?.();

      // Redirigir a la página principal
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const handleTestUser = (user: typeof TEST_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.15),_transparent_40%)]" />
      <div className="relative w-full max-w-md">
        <Card className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-center text-3xl font-semibold tracking-tight">
              Inicio de Sesión
            </CardTitle>
            <p className="text-center text-sm text-slate-400">
              Accede para administrar tus propiedades
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-700 bg-slate-950 text-white focus-visible:ring-sky-500"
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
                  className="border-slate-700 bg-slate-950 text-white focus-visible:ring-sky-500"
                  required
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-400">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-sky-600 text-white hover:bg-sky-500"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="mb-3 text-center text-sm text-slate-400">
                Usuarios de prueba:
              </p>
              <div className="space-y-2">
                {TEST_USERS.map((user, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleTestUser(user)}
                    className="w-full border border-slate-700 bg-slate-800 text-sm text-slate-100 hover:bg-slate-700"
                    variant="outline"
                  >
                    {user.role}: {user.email}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
