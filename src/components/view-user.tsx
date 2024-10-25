"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { UserData } from "@/lib/types";
import { fetchUsers, deleteUser } from "@/lib/api";
import AddEditUserForm from "./AddEditUserForm";

export default function ViewUser() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-orange-500">AAC</span>
        </div>
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Usuario
        </Button>
      </header>
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-orange-500">Lista Usuarios</h1>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsAddingUser(true)}
          >
            Agregar Usuario
          </Button>
        </div>
        {(isAddingUser || editingUser) && (
          <AddEditUserForm
            user={editingUser}
            onSave={() => {
              setIsAddingUser(false);
              setEditingUser(null);
              loadUsers();
            }}
            onCancel={() => {
              setIsAddingUser(false);
              setEditingUser(null);
            }}
          />
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Nombre</TableHead>
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Rol</TableHead>
              <TableHead className="text-right text-gray-300">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white mr-2"
                    onClick={() => setEditingUser(user)}
                  >
                    Modificar
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4 space-x-2">
          <Button variant="outline" size="default">
            {" "}
            {/* Cambiado "icon" a "default" */}
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline" size="default">
            {" "}
            {/* Cambiado "icon" a "default" */}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
