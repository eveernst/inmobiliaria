import { deleteInsurance } from '@/api/insuranceApi';
import { deletePlan } from '@/api/planApi';
import { deleteRented } from '@/api/rentedApi';
import { deleteWriting } from '@/api/writingApi';
import type { DocType } from '@/lib/types';

// Per-type dispatch for delete, so callers don't branch on the document type.
export const deleteDocument: Record<DocType, (id: number) => Promise<unknown>> = {
  insurance: deleteInsurance,
  rented: deleteRented,
  plan: deletePlan,
  writing: deleteWriting,
};
