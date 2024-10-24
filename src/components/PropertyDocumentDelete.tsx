"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Image as ImageIcon,
} from "lucide-react";

export default function PropertyDocumentDelete() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-lg font-semibold">AAC</span>
        </div>
        <Button variant="ghost">Categorías</Button>
        <div className="flex items-center">
          <span className="mr-2">Usuario</span>
          <User className="h-6 w-6" />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-700 rounded mr-4 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <CardTitle>Propiedad 1</CardTitle>
                <p className="text-sm text-gray-400">id: 1</p>
                <p className="text-sm text-gray-400">
                  clasificación: Propiedad
                </p>
                <p className="text-sm text-gray-400">destino: Habitacional</p>
                <p className="text-sm text-gray-400">
                  estado: disponible: Evelyn
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  Sistema
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Sistema</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <p>¿Está seguro que desea eliminar?</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600">
                      Aceptar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instalaciones</TableHead>
                    <TableHead>Clasificación</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Cocina",
                      classification: "Residencial",
                      quantity: 1,
                    },
                    {
                      name: "Habitación",
                      classification: "Residencial",
                      quantity: 4,
                    },
                    {
                      name: "Baño",
                      classification: "Residencial",
                      quantity: 2,
                    },
                  ].map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.classification}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Modificar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, type: "Escritura" },
                    { id: 2, type: "Seguro" },
                    { id: 3, type: "Plano" },
                  ].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Modificar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
