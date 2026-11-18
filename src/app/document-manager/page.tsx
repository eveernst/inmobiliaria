"use client";

import dynamic from "next/dynamic";
import { useRequireWriter } from "@/lib/useRequireWriter";

const PropertyDocumentManager = dynamic(
  () => import("../../components/DocumentManagerForm"),
  { ssr: false }
);

export default function DocumentManagerPage() {
  const allowed = useRequireWriter();
  if (!allowed) return null;

  return (
    <div>
      <PropertyDocumentManager />
    </div>
  );
}
