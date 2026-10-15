'use client';

import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <p className="mb-6 text-center text-slate-200">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
