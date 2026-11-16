'use client';

interface UnsavedChangesModalProps {
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

// Same overlay and panel as ConfirmModal, with the three choices for leaving a form
// that has pending changes (#77).
const UnsavedChangesModal = ({ onSave, onDiscard, onCancel }: UnsavedChangesModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="unsaved-changes-title"
  >
    <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <h2 id="unsaved-changes-title" className="mb-2 text-center text-lg font-semibold text-slate-100">
        Hay cambios sin guardar
      </h2>
      <p className="mb-6 text-center text-slate-200">
        Si volvés ahora, vas a perder los cambios que hiciste. ¿Querés guardarlos antes de salir?
      </p>
      <div className="flex flex-col gap-2">
        <button type="button" onClick={onSave} className="action-button-primary w-full">
          Guardar y volver
        </button>
        <button type="button" onClick={onDiscard} className="action-button-secondary w-full">
          Salir sin guardar
        </button>
        <button type="button" onClick={onCancel} className="action-button-secondary w-full">
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

export default UnsavedChangesModal;
