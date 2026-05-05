"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewProperty() {
  const [view, setView] = useState<"initial" | "new" | "modify">("new");
  const [formData, setFormData] = useState({
    id: "",
    address: "",
    classification: "",
    destiny: "",
    detailsMaintenance: "",
    file: "",
    goodUseCode: "",
    description: "",
    province: "",
    locality: "",
    betweenStreets: "",
    postalCode: "",
    district: "",
    destinyUse: "",
    status: "",
    clfc: "",
    securityCodeARM: "",
    state: "",
    innerImage: "",
    outerImage: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleValidation = () => {
    const requiredFields = ["securityCodeARM", "province", "locality", "address", "postalCode", "betweenStreets", "district", "destinyUse", "clfc", "state", "status", "description", "userId"];
    let isValid = true;
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        isValid = false;
        newErrors[field] = "Este campo es requerido";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      console.log("Formulario enviado con éxito:", formData);
      // Aquí iría la lógica para enviar el formulario al backend
    }
  };
  
  const renderPropertyForm = (title: string) => (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="string"
            name="securityCodeARM"
            value={formData.securityCodeARM}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Código Bien de Uso"
            required
          />
          {errors.securityCodeARM && <p className="text-red-500">{errors.securityCodeARM}</p>}

          <div className="flex space-x-2">
            <Button
              name="innerImage"
              value={formData.innerImage}
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
            >
              Imagen interior
            </Button>
            <Button
              name="outerImage"
              value={formData.outerImage}
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
            >
              Imagen exterior
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select name="province" onValueChange={(value) => handleSelectChange("province", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cordoba">Córdoba</SelectItem>
              <SelectItem value="entre-rios">Entre Ríos</SelectItem>
              <SelectItem value="santa-fe">Santa Fe</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="string"
            name="locality"
            value={formData.locality}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Localidad"
            required
          />
          {errors.locality && <p className="text-red-500">{errors.locality}</p>}

          <Input
            type="string"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Dirección completa"
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Código postal"
            required
          />
          {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}

          <Input
            type="string"
            name="betweenStreets"
            value={formData.betweenStreets}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Entre calles"
            required
          />
          {errors.betweenStreets && <p className="text-red-500">{errors.betweenStreets}</p>}

          <Input
            type="string"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Distrito"
            required
          />
          {errors.district && <p className="text-red-500">{errors.district}</p>}
        
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select name="destinyUse" onValueChange={(value) => handleSelectChange("destinyUse", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Destino de uso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="templo">Templo</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="antena">Antena</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="instituciones-educativas">
                Instituciones Educativas
              </SelectItem>
              <SelectItem value="predio">Predio</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>

          <Select name="clfc" onValueChange={(value) => handleSelectChange("clfc", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="CLFC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opción 1</SelectItem>
              <SelectItem value="option2">Opción 2</SelectItem>
              <SelectItem value="option3">Opción 3</SelectItem>
            </SelectContent>
          </Select>

          <Select name="state" onValueChange={(value) => handleSelectChange("state", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propia">Propia</SelectItem>
              <SelectItem value="alquilada">Alquilada</SelectItem>
              <SelectItem value="a-adquirir">A adquirir</SelectItem>
              <SelectItem value="a-vender">A vender</SelectItem>
              <SelectItem value="antena">Antena</SelectItem>
              <SelectItem value="a-administrar">A administrar</SelectItem>
              <SelectItem value="proceso">Proceso</SelectItem>
            </SelectContent>
          </Select>

          <Select name="status" onValueChange={(value) => handleSelectChange("status", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="detalles">
              Detalles de Mantenimiento (opcional)
            </Label>
            <Textarea
              name="detailsMaintenance"
              value={formData.detailsMaintenance}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600"
              placeholder="Ingrese detalles de mantenimiento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="description">Descripción</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600"
              placeholder="Ingrese una descripción"
              required
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Select name="userId" onValueChange={(value) => handleSelectChange("userId", value)} required>
            <SelectTrigger className="bg-gray-700 border-gray-600 w-48">
              <SelectValue placeholder="Usuario responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">Usuario 1</SelectItem>
              <SelectItem value="user2">Usuario 2</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button
              variant="outline"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Agregar Instalación
            </Button>
            <Button
              variant="outline"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Agregar Documentación
            </Button>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setView("initial")}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gray-700 hover:bg-gray-600">Aceptar</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <span className="text-xl font-bold">AAC</span>
        </div>
        <Button variant="ghost" className="text-gray-300">
          Usuario
        </Button>
      </header>

      {renderPropertyForm("Nueva Propiedad")}
    </div>
  );
}

