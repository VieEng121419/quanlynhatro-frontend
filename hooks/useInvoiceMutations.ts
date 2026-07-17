import { axiosClient } from "@/lib/api/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface finalizeDataType {
  newElectric: number;
  newWater: number;
}

export function useFinalizeInvoice(invoiceId: number, data: finalizeDataType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      axiosClient.post(`/invoice/${invoiceId}/counter`, {
        newElectric: data.newElectric,
        newWater: data.newWater,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useCancelInvoice() {
  //   const qc = useQueryClient();
  //   return useMutation({
  //     mutationFn: () => axiosClient.post(`/invoices/${invoiceId}/cancel`),
  //     onSuccess: () => {
  //       qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
  //       qc.invalidateQueries({ queryKey: ["invoices"] });
  //     },
  //   });
  console.log("canceled");
}
