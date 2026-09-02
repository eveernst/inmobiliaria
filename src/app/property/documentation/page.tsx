import { redirect } from "next/navigation";

interface DocumentationPageProps {
  searchParams?: {
    id?: string;
  };
}

export default function DocumentationPage({ searchParams }: DocumentationPageProps) {
  const propertyId = searchParams?.id;

  if (propertyId) {
    redirect(`/document-manager?propertyId=${encodeURIComponent(propertyId)}`);
  }

  redirect("/document-manager");
}
