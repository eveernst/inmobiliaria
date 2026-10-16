import { DOC_FIELDS, formatFieldValue, type FieldKind } from '@/lib/documentFields';
import { DOC_TYPE_LABELS, type DocType } from '@/lib/types';

export interface PdfProperty {
  address: string;
  locality?: string;
  province?: string;
}

const EMPTY = '—';

// "25 de Mayo 99" → "25-de-mayo-99": safe for filenames on every OS.
const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const documentPdfFilename = (type: DocType, property: PdfProperty | null, docId: number): string =>
  [slugify(DOC_TYPE_LABELS[type]), property ? slugify(property.address) : '', String(docId)]
    .filter(Boolean)
    .join('-') + '.pdf';

// One labeled row per field of the document type, formatted like the read-only
// view. Images are not embedded: the PDF is the record, not the uploaded files.
export const downloadDocumentPdf = async (
  type: DocType,
  docId: number,
  doc: Record<string, unknown>,
  property: PdfProperty | null,
): Promise<void> => {
  // Loaded on click so jspdf stays out of the page bundle and off the server render.
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  const marginX = 15;
  const valueX = 85;
  const valueWidth = 210 - valueX - marginX;
  const pageBottom = 280;
  const lineHeight = 5;
  let y = 20;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(`${DOC_TYPE_LABELS[type]} #${docId}`, marginX, y);
  y += 8;

  if (property) {
    const location = [property.address, property.locality, property.province].filter(Boolean).join(', ');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`Propiedad: ${location}`, marginX, y);
    y += 6;
  }

  pdf.setDrawColor(200);
  pdf.line(marginX, y, 210 - marginX, y);
  y += 8;

  pdf.setFontSize(10);
  const fields: { key: string; label: string; kind: FieldKind }[] = DOC_FIELDS[type];
  for (const { key, label, kind } of fields) {
    const raw = doc[key];
    const value = kind === 'image' ? (raw ? 'Adjunta' : EMPTY) : formatFieldValue(raw, kind);
    const labelLines: string[] = pdf.splitTextToSize(label, valueX - marginX - 4);
    const valueLines: string[] = pdf.splitTextToSize(value, valueWidth);
    const rowHeight = Math.max(labelLines.length, valueLines.length) * lineHeight;

    if (y + rowHeight > pageBottom) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(labelLines, marginX, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(valueLines, valueX, y);
    y += rowHeight + 2;
  }

  pdf.save(documentPdfFilename(type, property, docId));
};
