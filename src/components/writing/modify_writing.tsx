import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

export default function ModifyWriting() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xl font-bold">AAC</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Usuario</span>
          <User className="text-orange-500" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">
            Modificar Documentación
          </h1>
          <Select>
            <option>Escritura</option>
          </Select>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nEscritura">N° de escritura</Label>
              <Input id="nEscritura" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="nVotoJDAAC">N° de Voto de JD AAC</Label>
              <Input id="nVotoJDAAC" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="fechaJDAAC">Fecha de JD AAC</Label>
              <Input id="fechaJDAAC" type="date" className="bg-gray-800" />
            </div>
            <div>
              <Label>Imagen de Voto de JD AAC</Label>
              <Button variant="outline" className="w-full">
                imagen
              </Button>
            </div>
            <div>
              <Label htmlFor="nVotoJDUA">N° de Voto de JD UA</Label>
              <Input id="nVotoJDUA" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="fechaJDUA">Fecha de JD UA</Label>
              <Input id="fechaJDUA" type="date" className="bg-gray-800" />
            </div>
            <div>
              <Label>Imagen de Voto de JD UA</Label>
              <Button variant="outline" className="w-full">
                imagen
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label htmlFor="dominio">Dominio</Label>
              <Input id="dominio" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="folio">Folio</Label>
              <Input id="folio" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="tomo">Tomo</Label>
              <Input id="tomo" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="ano">Año</Label>
              <Input id="ano" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input id="departamento" className="bg-gray-800" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="superficieTotal">Superficie Total</Label>
              <Input id="superficieTotal" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="superficieCubierta">Superficie cubierta</Label>
              <Input id="superficieCubierta" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="supConMejoras">Sup. con mejoras</Label>
              <Input id="supConMejoras" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="valor">$</Label>
              <Input id="valor" className="bg-gray-800" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomenclaturaCatastral">
                Nomenclatura catastral
              </Label>
              <Input id="nomenclaturaCatastral" className="bg-gray-800" />
            </div>
            <div>
              <Label>Ubicación en mapa</Label>
              <Button variant="outline" className="w-full">
                Link o PDF
              </Button>
            </div>
            <div>
              <Label htmlFor="escribanoActuante">Escribano Actuante</Label>
              <Input id="escribanoActuante" className="bg-gray-800" />
            </div>
            <div>
              <Label htmlFor="contactoEscribano">Contacto del escribano</Label>
              <Input id="contactoEscribano" className="bg-gray-800" />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Foto Interior</Button>
            <Button variant="outline">Foto Interior</Button>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Detalle Espacios</Button>
            <Button variant="outline">Documentación</Button>
            <Button variant="outline">Detalle Espacios</Button>
          </div>
          <Textarea className="bg-gray-800" rows={4} />
          <div className="flex justify-end space-x-4">
            <Button variant="destructive">Cancelar</Button>
            <Button>Aceptar</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
