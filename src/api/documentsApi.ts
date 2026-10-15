import { deleteInsurance, getInsuranceById } from '@/api/insuranceApi';
import { deletePlan, getPlanById } from '@/api/planApi';
import { deleteRented, getRentedById } from '@/api/rentedApi';
import { deleteWriting, getWritingById } from '@/api/writingApi';
import type { DocType } from '@/lib/types';

// Per-type dispatch for delete, so callers don't branch on the document type.
export const deleteDocument: Record<DocType, (id: number) => Promise<unknown>> = {
  insurance: deleteInsurance,
  rented: deleteRented,
  plan: deletePlan,
  writing: deleteWriting,
};

// Per-type dispatch for fetch-by-id. The underlying calls throw on 404.
export const getDocumentById: Record<DocType, (id: number) => Promise<Record<string, unknown> | undefined>> = {
  insurance: getInsuranceById,
  rented: getRentedById,
  plan: getPlanById,
  writing: getWritingById,
};
