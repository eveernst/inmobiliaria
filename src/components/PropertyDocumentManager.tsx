"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ImageIcon } from "lucide-react";

export default function PropertyDocumentManager() {
  const [activeTab, setActiveTab] = useState("seguro-inmueble");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-lg font-semibold">AAC</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Usuario</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Nueva Documentación</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="seguro-inmueble">
                  Seguro inmueble
                </TabsTrigger>
                <TabsTrigger value="inmueble-alquilado">
                  Inmueble alquilado
                </TabsTrigger>
                <TabsTrigger value="plano-casa">Plano de casa</TabsTrigger>
                <TabsTrigger value="escritura">Escritura</TabsTrigger>
              </TabsList>
              <TabsContent value="seguro-inmueble">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre-completo">Nombre completo</Label>
                      <Input id="nombre-completo" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" className="bg-gray-700" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" className="bg-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="bien-asegurado">Bien asegurado</Label>
                    <Select>
                      <SelectTrigger
                        id="bien-asegurado"
                        className="bg-gray-700"
                      >
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Opción 1</SelectItem>
                        <SelectItem value="option2">Opción 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo de seguro que se registra</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Responsabilidad Civil
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Aseguradora ARM
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Aseguradora ART
                      </label>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Observaciones"
                    className="bg-gray-700"
                  />
                </form>
              </TabsContent>
              <TabsContent value="inmueble-alquilado">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="datos-propietario">
                        Datos del propietario
                      </Label>
                      <Input id="datos-propietario" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="contacto-propietario">Contacto</Label>
                      <Input
                        id="contacto-propietario"
                        className="bg-gray-700"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="datos-inquilino">
                        Datos del inquilino
                      </Label>
                      <Input id="datos-inquilino" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="contacto-inquilino">Contacto</Label>
                      <Input id="contacto-inquilino" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha-comienzo">
                        Fecha de comienzo del contrato
                      </Label>
                      <div className="relative">
                        <Input id="fecha-comienzo" className="bg-gray-700" />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fecha-finalizacion">
                        Fecha de finalización del contrato
                      </Label>
                      <div className="relative">
                        <Input
                          id="fecha-finalizacion"
                          className="bg-gray-700"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monto">Monto $</Label>
                      <Input id="monto" type="number" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="tipo-ajuste">Tipo de ajuste</Label>
                      <Input id="tipo-ajuste" className="bg-gray-700" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contrato">Contrato</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Ver imagen
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="plano-casa">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plano-general">Plano General</Label>
                      <Input id="plano-general" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="nro-plano">N° de Plano</Label>
                      <Input id="nro-plano" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profesional">Profesional</Label>
                      <Input id="profesional" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="visado-municipal">Visado Municipal</Label>
                      <Input id="visado-municipal" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="plano-estructura">Plano estructura</Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="plano-gas">Plano gas</Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="plano-agua">Plano agua</Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label>ACTUALIZACIÓN</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="tipo-plano">Tipo de plano</Label>
                        <Select>
                          <SelectTrigger
                            id="tipo-plano"
                            className="bg-gray-700"
                          >
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Opción 1</SelectItem>
                            <SelectItem value="option2">Opción 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nro-plano-actualizacion">
                          N° de Plano
                        </Label>
                        <Input
                          id="nro-plano-actualizacion"
                          className="bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Trámites / Documentación / Contactos"
                    className="bg-gray-700"
                  />
                </form>
              </TabsContent>
              <TabsContent value="escritura">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nro-escritura">N° de escritura</Label>
                      <Input id="nro-escritura" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="nro-voto-jd-aac">
                        N° de voto de JD AAC
                      </Label>
                      <Input id="nro-voto-jd-aac" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha-jd-aac">Fecha de JD AAC</Label>
                      <div className="relative">
                        <Input id="fecha-jd-aac" className="bg-gray-700" />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imagen-voto-jd-aac">
                        Imagen de Voto de JD AAC
                      </Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nro-voto-jd-ua">
                        N° de voto de JD UA
                      </Label>
                      <Input id="nro-voto-jd-ua" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="fecha-jd-ua">Fecha de JD UA</Label>
                      <div className="relative">
                        <Input id="fecha-jd-ua" className="bg-gray-700" />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="imagen-voto-jd-ua">
                        Imagen de Voto de JD UA
                      </Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dominio">Dominio</Label>
                      <Input id="dominio" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="folio">Folio</Label>
                      <Input id="folio" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="tomo">Tomo</Label>
                      <Input id="tomo" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ano">Año</Label>
                      <Input id="ano" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input id="departamento" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="superficie-total">Superficie Total</Label>
                      <Input id="superficie-total" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="superficie-cubierta">
                        Superficie cubierta
                      </Label>
                      <Input id="superficie-cubierta" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomenclatura-catastral">
                        Nomenclatura catastral
                      </Label>
                      <Input
                        id="nomenclatura-catastral"
                        className="bg-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ubicacion-mapa">Ubicación en mapa</Label>
                      <Input id="ubicacion-mapa" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="escribano-actuante">
                        Escribano Actuante
                      </Label>
                      <Input id="escribano-actuante" className="bg-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="contacto-escribano">
                        Contacto del escribano
                      </Label>
                      <Input id="contacto-escribano" className="bg-gray-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="folio-interior">Folio Interior</Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="folio-exterior">Folio Exterior</Label>
                      <Button variant="outline" className="w-full bg-gray-700">
                        <ImageIcon className="mr-2 h-4 w-4" /> Imagen
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Detalle Espacios / Documentación / Detalle Espacios"
                    className="bg-gray-700"
                  />
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4 mt-4">
          <Button
            variant="outline"
            className="bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            Aceptar
          </Button>
        </div>
      </main>
    </div>
  );
}
