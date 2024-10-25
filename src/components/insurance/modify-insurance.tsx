import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function ModifyInsurance() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xl font-bold text-orange-500">AAC</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Usuario</span>
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-6">
          Modificar Documentación
        </h1>

        <div className="mb-6">
          <Select>
            <option>Seguro inmueble</option>
          </Select>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable del seguro ARM</Label>
            <Input id="responsable" placeholder="Nombre completo" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bien-asegurado">Bien asegurado</Label>
            <Select>
              <option>Seleccionar</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de seguro que se registra</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Checkbox id="responsabilidad-civil" />
                <Label htmlFor="responsabilidad-civil" className="ml-2">
                  Responsabilidad Civil
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="propiedades" />
                <Label htmlFor="propiedades" className="ml-2">
                  Propiedades
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="equipo" />
                <Label htmlFor="equipo" className="ml-2">
                  Equipo
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="contenido" />
                <Label htmlFor="contenido" className="ml-2">
                  Contenido
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox id="valores" />
                <Label htmlFor="valores" className="ml-2">
                  Valores
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Formulario de seguro</Label>
            <div className="flex space-x-2">
              <Button variant="outline">Link</Button>
              <Button variant="outline">Imagen</Button>
              <Input type="date" className="w-auto" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Formulario anual</Label>
            <div className="flex space-x-2">
              <Button variant="outline">Link</Button>
              <Button variant="outline">Imagen</Button>
              <Input type="date" className="w-auto" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea id="observaciones" rows={4} />
          </div>

          <div className="flex space-x-4">
            <Button variant="destructive" className="w-full">
              Cancelar
            </Button>
            <Button className="w-full">Aceptar</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
