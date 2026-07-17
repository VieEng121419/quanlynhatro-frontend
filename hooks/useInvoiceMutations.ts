import { axiosClient } from "@/lib/api/axios-client";
import { AxiosError } from "@/lib/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useCancelInvoice(invoiceId: number | null) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () => axiosClient.patch(`/invoice/${invoiceId}/status`, {
        status: "CANCELLED"
      }),
      onSuccess: () => {
        toast.success("Đã huỷ thành công hoá đơn!")
        qc.invalidateQueries({ queryKey: ["invoice", invoiceId] });
        qc.invalidateQueries({ queryKey: ["invoices"] });
      },
      onError: (error: AxiosError) => {
        toast.error(error.message)
      }
    });
}
