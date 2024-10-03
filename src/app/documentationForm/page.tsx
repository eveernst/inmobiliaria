import DocumentationForm from "@/components/documentation-form";

export const metadata = {
  title: "Nueva Documentación | AAC",
  description: "Formulario para agregar nueva documentación en el sistema AAC",
};

export default function NuevaDocumentacionPage() {
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
        <DocumentationForm />
      </main>
    </div>
  );
}
