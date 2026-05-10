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
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

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
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
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

            <div className="mt-6 pt-6 border-t border-gray-600">
              <p className="text-sm text-gray-400 mb-3 text-center">
                Usuarios de prueba:
              </p>
              <div className="space-y-2">
                {TEST_USERS.map((user, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleTestUser(user)}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white text-sm"
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
