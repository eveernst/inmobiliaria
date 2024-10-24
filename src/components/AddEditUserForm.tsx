import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { UserData } from "@/lib/types";
import { addUser, updateUser } from "@/lib/api";

interface AddEditUserFormProps {
  user?: UserData | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddEditUserForm({
  user,
  onSave,
  onCancel,
}: AddEditUserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    id: user?.id ?? 0,
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "Usuario",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar el cambio del valor de react-select
  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      setFormData((prev) => ({ ...prev, role: selectedOption.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUser(formData);
    } else {
      await addUser(formData);
    }
    onSave();
  };

  // Opciones para el Select
  const roleOptions = [
    { value: "Usuario", label: "Usuario" },
    { value: "Administrador", label: "Administrador" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="bg-gray-700 text-white"
        />
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-gray-700 text-white"
        />
        <Select
          options={roleOptions}
          value={roleOptions.find((option) => option.value === formData.role)}
          onChange={handleSelectChange}
          className="bg-gray-700 text-white"
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {user ? "Actualizar" : "Agregar"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="text-gray-300 hover:text-white"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
