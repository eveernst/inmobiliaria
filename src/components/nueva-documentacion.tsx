import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <h1 className="text-xl font-bold text-orange-500">AAC</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Usuario</span>
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">
            Nueva Documentacion
          </h2>
          <Select>
            <option>Seguro inmueble</option>
          </Select>
        </div>

        <form className="space-y-6">
          <div>
            <Label htmlFor="responsable">Responsable del seguro ARM</Label>
            <Input id="responsable" className="bg-gray-800 border-gray-700" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" className="bg-gray-800 border-gray-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bien">Bien asegurado</Label>
              <div id="bien" className="w-full bg-gray-800 border-gray-700">
                <Select>
                  <option>Seleccionar</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tipo de seguro que se registra</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox id="responsabilidad" className="mr-2" />
                  <Label htmlFor="responsabilidad">Responsabilidad Civil</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Checkbox id="arm" className="mr-2" />
                    <Label htmlFor="arm">Aseguradora ARM</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="ase" className="mr-2" />
                    <Label htmlFor="ase">Aseguradora ASE</Label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Checkbox id="propiedades" className="mr-2" />
                    <Label htmlFor="propiedades">Propiedades</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="equipo" className="mr-2" />
                    <Label htmlFor="equipo">Equipo</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="contenido" className="mr-2" />
                    <Label htmlFor="contenido">Contenido</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="valores" className="mr-2" />
                    <Label htmlFor="valores">Valores</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Formulario de seguro</Label>
            <div className="flex space-x-4">
              <Button variant="secondary" className="bg-gray-800">
                Link
              </Button>
              <Button variant="secondary" className="bg-gray-800">
                Imagen
              </Button>
              <Input type="date" className="bg-gray-800 border-gray-700" />
            </div>
          </div>

          <div>
            <Label>Formulario anual</Label>
            <div className="flex space-x-4">
              <Button variant="secondary" className="bg-gray-800">
                Link
              </Button>
              <Button variant="secondary" className="bg-gray-800">
                Imagen
              </Button>
              <Input type="date" className="bg-gray-800 border-gray-700" />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              className="bg-gray-800 border-gray-700"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="destructive"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Cancelar
            </Button>
            <Button variant="default" className="bg-gray-700 hover:bg-gray-600">
              Aceptar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
