import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <span className="text-xl font-bold">AAC</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Usuario</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
        </div>
      </header>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          Nueva Documentacion
        </h1>
        <form className="space-y-6">
          <div className="flex justify-end">
            <Select>
              <option>Escritura</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="escritura">N° de escritura</Label>
              <Input id="escritura" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="votoAAC">N° de Voto de JD AAC</Label>
              <Input id="votoAAC" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="imagenAAC">Imagen de Voto de JD AAC</Label>
              <Input id="imagenAAC" type="file" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="fechaAAC">Fecha de JD AAC</Label>
              <Input id="fechaAAC" type="date" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="votoUA">N° de Voto de JD UA</Label>
              <Input id="votoUA" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="imagenUA">Imagen de Voto de JD UA</Label>
              <Input id="imagenUA" type="file" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="fechaUA">Fecha de JD UA</Label>
              <Input id="fechaUA" type="date" className="bg-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <Label htmlFor="ano">Año</Label>
              <Input id="ano" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input id="departamento" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="superficieTotal">Superficie Total</Label>
              <Input id="superficieTotal" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="superficieCubierta">Superficie cubierta</Label>
              <Input id="superficieCubierta" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="supConMejoras">Sup. con mejoras</Label>
              <Input id="supConMejoras" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="valor">$</Label>
              <Input id="valor" className="bg-gray-700" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomenclatura">Nomenclatura catastral</Label>
              <Input id="nomenclatura" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="ubicacion">Ubicación en mapa</Label>
              <Input id="ubicacion" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="escribano">Escribano Actuante</Label>
              <Input id="escribano" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="contacto">Contacto del escribano</Label>
              <Input id="contacto" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="informe">Informe catastral</Label>
              <Input id="informe" type="file" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="pdf">Link o PDF</Label>
              <Input id="pdf" type="file" className="bg-gray-700" />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Foto interior</Button>
            <Button variant="outline">Foto interior</Button>
          </div>
          <div className="space-y-2">
            <div className="flex space-x-4">
              <Button variant="secondary">Detalle Espacios</Button>
              <Button variant="secondary">Documentación</Button>
              <Button variant="secondary">Detalle Espacios</Button>
            </div>
            <Textarea className="bg-gray-700 h-32" />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="destructive">Cancelar</Button>
            <Button>Aceptar</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
