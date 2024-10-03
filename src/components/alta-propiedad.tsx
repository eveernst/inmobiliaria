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

export default function AltaPropiedad() {
  const [view, setView] = useState<"initial" | "new" | "modify">("initial");

  const renderInitialView = () => (
    <Card className="w-full max-w-md mx-auto bg-gray-800 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-500">
          Nueva propiedad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          className="bg-gray-700 border-gray-600"
          placeholder="Nombre de la propiedad"
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
            onClick={() => setView("modify")}
          >
            Modificar
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
          >
            Eliminar
          </Button>
        </div>
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => setView("new")}
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );

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
            className="bg-gray-700 border-gray-600"
            placeholder="Código Bien de Uso"
          />
          <Input
            className="bg-gray-700 border-gray-600"
            placeholder="Código Bien de Uso"
          />
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
            >
              Imagen interior
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-300"
            >
              Imagen exterior
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select>
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
            className="bg-gray-700 border-gray-600"
            placeholder="Localidad"
          />
          <Input
            className="bg-gray-700 border-gray-600"
            placeholder="Dirección completa"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            className="bg-gray-700 border-gray-600"
            placeholder="Código postal"
          />
          <Input
            className="bg-gray-700 border-gray-600"
            placeholder="Entre calles"
          />
          <Input
            className="bg-gray-700 border-gray-600"
            placeholder="Distrito"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select>
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
          <Select>
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
          <Select>
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
              id="detalles"
              className="bg-gray-700 border-gray-600"
              placeholder="Ingrese detalles de mantenimiento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              className="bg-gray-700 border-gray-600"
              placeholder="Ingrese una descripción"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Select>
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
          <Button className="bg-gray-700 hover:bg-gray-600">Aceptar</Button>
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

      {view === "initial" && renderInitialView()}
      {view === "new" && renderPropertyForm("Nueva Propiedad")}
      {view === "modify" && renderPropertyForm("Modificar Propiedad")}
    </div>
  );
}
