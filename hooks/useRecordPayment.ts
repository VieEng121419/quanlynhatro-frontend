import { axiosClient } from "@/lib/api/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RecordPaymentInput {
  invoiceId: number;
  status: "PAID" | "PARTIAL";
  paidAmount: number; // tổng cumulative, không phải số tiền nhập lần này
}

export function useRecordPayment(invoiceId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      paidAmount,
    }: Omit<RecordPaymentInput, "invoiceId">) =>
      axiosClient.patch(`/invoice/${invoiceId}/status`, { status, paidAmount }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
