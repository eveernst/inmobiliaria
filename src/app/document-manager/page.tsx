import dynamic from "next/dynamic";

const PropertyDocumentManager = dynamic(
  () => import("../../components/DocumentManagerForm"),
  { ssr: false }
);

export default function DocumentManagerPage() {
  return (
    <div>
      <PropertyDocumentManager />
    </div>
  );
}
