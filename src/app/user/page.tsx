"use client";

import React, { useState, useEffect } from "react";
import { UserData, ROLE_LABELS, ROLE_OPTIONS } from "@/lib/types";
import { fetchUsers, deleteUser, addUser, updateUser } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/formFeedback";
import { useRouter } from "next/navigation";

// ── Modal de confirmación ─────────────────────────────────────────────────────
const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <p className="mb-6 text-center text-slate-200">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 rounded-lg border border-slate-600 bg-slate-800 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
          Cancelar
        </button>
        <button onClick={onConfirm} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-500">
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// ── Formulario agregar/editar usuario ─────────────────────────────────────────
const UserForm = ({
  user,
  onSave,
  onCancel,
}: {
  user?: UserData | null;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? 2,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Nombre y email son obligatorios.");
      return;
    }
    if (!user && !formData.password.trim()) {
      setError("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (user) {
        await updateUser({ ...formData, id: user.id });
      } else {
        await addUser(formData);
      }
      onSave();
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
        {user ? "Editar usuario" : "Nuevo usuario"}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Nombre</label>
          <input
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Nombre completo"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Contraseña {user && <span className="text-slate-500">(dejar vacío para no cambiar)</span>}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Rol</label>
          <select
            value={formData.role}
            onChange={e => setFormData(p => ({ ...p, role: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
          >
            {ROLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-red-400">{error}</p>
        )}

        <div className="sm:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
          >
            {saving ? "Guardando..." : user ? "Actualizar" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
export default function ViewUser() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [confirm, setConfirm] = useState<{ show: boolean; userId: number; name: string }>({
    show: false, userId: 0, name: "",
  });

  // Verificar que sea superusuario
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role !== 3) router.push("/");
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (user: UserData) => {
    setConfirm({ show: true, userId: user.id, name: user.name });
  };

  const handleDeleteExecute = async () => {
    try {
      await deleteUser(confirm.userId);
      setConfirm({ show: false, userId: 0, name: "" });
      loadUsers();
    } catch {
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <>
      {confirm.show && (
        <ConfirmModal
          message={`¿Eliminar al usuario "${confirm.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteExecute}
          onCancel={() => setConfirm({ show: false, userId: 0, name: "" })}
        />
      )}

      <div className="min-h-screen bg-slate-950 pb-16 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Gestión de usuarios</h1>
              <p className="mt-1 text-sm text-slate-400">{users.length} usuarios registrados</p>
            </div>
            <button
              onClick={() => { setEditingUser(null); setShowForm(true); }}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              + Nuevo usuario
            </button>
          </div>

          {/* Formulario */}
          {(showForm || editingUser) && (
            <UserForm
              user={editingUser}
              onSave={() => { setShowForm(false); setEditingUser(null); loadUsers(); }}
              onCancel={() => { setShowForm(false); setEditingUser(null); }}
            />
          )}

          {/* Tabla */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500" />
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center text-slate-500">No hay usuarios registrados.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-800 bg-slate-900/80">
                    <tr>
                      {["Nombre", "ID", "Email", "Rol", "Acciones"].map((h, i) => (
                        <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${i === 4 ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-800 transition hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-200">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{user.id}</td>
                        <td className="px-4 py-3 text-slate-300">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            user.role === 3 ? "bg-purple-500/20 text-purple-300" :
                            user.role === 1 ? "bg-orange-500/20 text-orange-300" :
                            "bg-slate-700 text-slate-300"
                          }`}>
                            {ROLE_LABELS[user.role] ?? `Rol ${user.role}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setEditingUser(user); setShowForm(false); }}
                              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                            >
                              Modificar
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(user)}
                              className="rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-900/40"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
