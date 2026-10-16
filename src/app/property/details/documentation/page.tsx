'use client';

import { deleteDocument, getDocumentById } from '@/api/documentsApi';
import { getProperty } from '@/api/propertyApi';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageViewModal from '@/components/ui/ImageViewModal';
import { DOC_FIELDS, formatFieldValue, type FieldKind } from '@/lib/documentFields';
import { downloadDocumentPdf, type PdfProperty } from '@/lib/documentPdf';
import { canWriteProperties, DOC_TYPE_LABELS, isDocType, type DocType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ViewParams {
  propertyId: number | null;
  docType: DocType;
  docId: number;
}

const toPositiveInt = (raw: string | null): number | null => {
  const n = Number(raw);
  return raw !== null && Number.isInteger(n) && n > 0 ? n : null;
};

const DocumentView: React.FC = () => {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [params, setParams] = useState<ViewParams | null>(null);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [property, setProperty] = useState<PdfProperty | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = toPositiveInt(query.get('id'));
    const docType = query.get('docType');
    const docId = toPositiveInt(query.get('docId'));
    setPropertyId(id);

    try {
      const saved = localStorage.getItem('user');
      if (saved) setIsAdmin(canWriteProperties(JSON.parse(saved)?.role));
    } catch { /* sin sesión */ }

    if (!isDocType(docType) || docId === null) { setStatus('error'); return; }
    setParams({ propertyId: id, docType, docId });

    // Only for the PDF header and filename: the view works without it.
    if (id) {
      getProperty(id)
        .then((p) => { if (p?.address) setProperty({ address: p.address, locality: p.locality, province: p.province }); })
        .catch((err) => console.error('Error cargando propiedad:', err));
    }

    getDocumentById[docType](docId)
      .then((data) => {
        if (data) { setDoc(data); setStatus('ready'); } else setStatus('error');
      })
      .catch((err) => { console.error('Error cargando documento:', err); setStatus('error'); });
  }, []);

  const backUrl = propertyId ? `/property/details?id=${propertyId}` : '/';

  const handleDelete = async () => {
    setConfirmOpen(false);
    if (!params) return;
    try {
      await deleteDocument[params.docType](params.docId);
      router.push(backUrl);
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el documento.');
    }
  };

  const handleDownloadPdf = async () => {
    if (!params || !doc) return;
    setDownloading(true);
    try {
      await downloadDocumentPdf(params.docType, params.docId, doc, property);
    } catch (err) {
      console.error(err);
      alert('No se pudo generar el PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-orange-500" />
      </div>
    );
  }

  if (status === 'error' || !params || !doc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
        <p className="text-lg">No se pudo cargar el documento.</p>
        <button
          onClick={() => router.push(backUrl)}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Volver
        </button>
      </div>
    );
  }

  const fields: { key: string; label: string; kind: FieldKind }[] = DOC_FIELDS[params.docType];

  return (
    <>
      {confirmOpen && (
        <ConfirmModal
          message={`¿Eliminar el documento "${DOC_TYPE_LABELS[params.docType]} #${params.docId}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      <div className="min-h-screen bg-slate-950 pb-16 pt-8 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
                {DOC_TYPE_LABELS[params.docType]}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-slate-100 md:text-3xl">
                Documento #{params.docId}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(backUrl)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-slate-700"
              >
                ← Volver
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-300 transition hover:bg-orange-500/20 disabled:opacity-50"
              >
                {downloading ? 'Generando…' : 'Descargar PDF'}
              </button>
              {isAdmin && (
                <>
                  {params.propertyId && (
                    <button
                      onClick={() => router.push(`/document-manager?propertyId=${params.propertyId}&docType=${params.docType}&docId=${params.docId}`)}
                      className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-400"
                    >
                      Modificar
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-900/40"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
              Información del documento
            </h2>
            <dl className="grid gap-x-8 gap-y-2.5 text-sm md:grid-cols-2">
              {fields.map(({ key, label, kind }) => {
                const value = doc[key];
                const imageUrl = typeof value === 'string' ? value : undefined;
                return (
                  <div
                    key={key}
                    className={`flex justify-between gap-2 border-b border-slate-800 pb-2 ${kind === 'multiline' ? 'md:col-span-2' : ''}`}
                  >
                    <dt className="text-slate-400">{label}</dt>
                    <dd className={`text-right font-medium text-slate-200 ${kind === 'multiline' ? 'whitespace-pre-wrap' : ''}`}>
                      {kind === 'image'
                        ? (imageUrl ? <ImageViewModal imageUrl={imageUrl} imageName={label} /> : '—')
                        : formatFieldValue(value, kind)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
};

export default DocumentView;
