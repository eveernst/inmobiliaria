import React, { useMemo, useState } from "react";
import { resolveImageUrl } from "@/lib/imageUpload";

interface ImageViewModalProps {
  imageUrl?: string;
  imageName?: string;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ imageUrl, imageName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hasImageError, setHasImageError] = useState(false);
  const resolvedImageUrl = useMemo(() => resolveImageUrl(imageUrl), [imageUrl]);

  const openModal = () => {
    setZoom(1);
    setHasImageError(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setZoom(1);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setZoom(1);

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoom((prev) => {
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const next = prev + delta;
      return Math.min(Math.max(next, 0.6), 5);
    });
  };

  if (!resolvedImageUrl) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
      >
        Ver imagen
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 p-3 md:p-6">
          <div className="relative mx-auto flex h-full w-full max-w-[96vw] flex-col rounded-lg bg-slate-900">
            <div className="flex flex-wrap items-center justify-center gap-3 border-b border-slate-700 px-4 py-3">
              {imageName && <p className="w-full text-center font-semibold text-slate-100">{imageName}</p>}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded bg-slate-700 px-3 py-1 text-white hover:bg-slate-600"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded bg-slate-700 px-3 py-1 text-white hover:bg-slate-600"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="rounded bg-slate-600 px-3 py-1 text-white hover:bg-slate-500"
                >
                  Reset
                </button>
                <span className="text-sm text-slate-200">Zoom: {Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div
              className="flex-1 overflow-auto bg-slate-950"
              onWheel={handleWheelZoom}
            >
              <div className="flex min-h-full min-w-full items-center justify-center p-4 md:p-8">
                {!hasImageError ? (
                  <img
                    src={resolvedImageUrl}
                    alt={imageName || "Imagen"}
                    className="h-auto w-auto max-w-[92vw] max-h-[82vh]"
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                    onError={() => setHasImageError(true)}
                  />
                ) : (
                  <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-center text-amber-200">
                    No se pudo cargar la imagen guardada.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewModal;
