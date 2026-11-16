'use client';

import { MutableRefObject, useCallback, useEffect, useState } from "react";

/** Saves the form without its own redirect. Resolves true only when the API accepted it. */
export type SaveBeforeLeave = () => Promise<boolean>;

/** Props the document manager passes to each document form (#77). */
export interface UnsavedChangesProps {
  onDirtyChange?: (dirty: boolean) => void;
  saveRef?: MutableRefObject<SaveBeforeLeave | null>;
}

interface UseUnsavedChangesOptions extends UnsavedChangesProps {
  isDirty: boolean;
  isReadOnly: boolean;
  save: SaveBeforeLeave;
}

/**
 * Reports pending changes to the document manager so "← Volver" can warn first (#77).
 * Images are stored with setValue, outside the registered inputs, so react-hook-form's
 * isDirty doesn't see them: the form calls markFilesChanged() on upload and removal.
 */
export function useUnsavedChanges({ isDirty, isReadOnly, onDirtyChange, saveRef, save }: UseUnsavedChangesOptions) {
  const [filesChanged, setFilesChanged] = useState(false);
  const hasUnsavedChanges = !isReadOnly && (isDirty || filesChanged);

  useEffect(() => {
    onDirtyChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onDirtyChange]);

  // A form that unmounts (tab or property change) leaves nothing pending behind.
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  // Re-registered every render so the manager always calls the latest closure.
  useEffect(() => {
    if (!saveRef) return;
    saveRef.current = save;
    return () => {
      saveRef.current = null;
    };
  });

  const markFilesChanged = useCallback(() => setFilesChanged(true), []);
  const clearFilesChanged = useCallback(() => setFilesChanged(false), []);

  return { markFilesChanged, clearFilesChanged };
}
