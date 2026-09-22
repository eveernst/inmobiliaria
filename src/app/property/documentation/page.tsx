import { redirect } from "next/navigation";

interface DocumentationPageProps {
  searchParams?: Promise<{
    id?: string;
  }>;
}

export default async function DocumentationPage({ searchParams }: DocumentationPageProps) {
  const propertyId = (await searchParams)?.id;

  if (propertyId) {
    redirect(`/document-manager?propertyId=${encodeURIComponent(propertyId)}`);
  }

  redirect("/document-manager");
}
