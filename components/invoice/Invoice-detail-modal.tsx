"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";
import dayjs from "dayjs";
import { Droplets, FileText, MoveRight, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { InvoiceActionButtons } from "./invoice-action-buttons";
import { useCancelInvoice } from "@/hooks/useInvoiceMutations";
import { PaymentModal } from "./payment-modal";

interface InvoiceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number | null;
}

export function InvoiceDetailModal({
  open,
  onOpenChange,
  invoiceId,
}: InvoiceDetailModalProps) {
  const queryClient = useQueryClient();
  const [newElectricValue, setNewElectricValue] = useState<number | null>(null);
  const [newWatercValue, setNewWaterValue] = useState<number | null>(null);

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => axiosClient.get(`/invoice/${invoiceId}`),
    enabled: !!invoiceId && open,
  });

  const cancelMutation = useCancelInvoice(invoiceId);

  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.patch(`/invoice/${invoiceId}/counter`, {
        newElectric: newElectricValue ?? 0,
        newWater: newWatercValue ?? 0,
      });
    },
    onSuccess: () => {
      toast.success(`Cập nhật hoá đơn #${invoiceId} thành công`);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      //   onOpenChange(false);
      setNewElectricValue(null);
      setNewWaterValue(null);
    },
    onError: (err) => {
      toast.error(err?.message || "Tạo hợp đồng thất bại");
    },
  });

  const invoice = data?.data;

  const formatMoney = (amount: string | number = 0) => {
    return Number(amount).toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const style = getInvoiceStatusStyle(invoice?.status);

  useEffect(() => {
    if (!open) {
      setPaymentModalOpen(false);
      // setPendingConfirm(null)
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-h-[100vh] max-h-[90vh] overflow-y-auto p-0 sm:max-w-[740px] max-sm:rounded-none! rounded-3xl!">
        <X
          className="absolute top-4 right-4 cursor-pointer z-20 text-[#1D2940]"
          onClick={() => onOpenChange(false)}
        />
        <DialogHeader className="border-b bg-[#fffaf8] p-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-start gap-4 pr-7">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[22px] bg-[#fff0ec] text-[#e34b35]">
              <FileText className="size-6" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-lg font-bold tracking-tight text-[#111a31]">
                  Phòng {invoice?.id}
                </DialogTitle>
                <Badge
                  className={`${style.bg} ${style.text} rounded-full px-3 py-1 text-xs font-bold`}
                >
                  {getInvoiceStatusLabel(invoice?.status)}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#8fa0bb] sm:text-base max-sm:flex max-sm:items-center max-sm:justify-start">
                {/* Hợp đồng #{invoice?.contractId} */}
                <span className="mr-2">•</span>
                <span className="text-sm mr-1">Mã HĐ:</span>
                <span className="font-semibold text-[#4d5b72]">
                  HD-{invoice?.contractId}
                </span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-7 px-4 py-2 sm:px-8">
          <div className="grid gap-x-8 rounded-[22px] border border-[#e8eef5] bg-[#fbfcfe] px-4 py-4 sm:grid-cols-2 sm:px-5">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-dashed border-[#dfe6ef] pb-2 text-sm sm:text-base">
                <span className="text-[#71829e] font-medium text-sm">
                  Kỳ tính:
                </span>
                <span className="font-semibold text-[#1d2940] text-sm">
                  {formatDate(invoice?.fromDate)} -{" "}
                  {formatDate(invoice?.toDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base pb-2 max-sm:border-b max-sm:border-dashed max-sm:border-[#dfe6ef]">
                <span className="text-[#71829e] text-sm font-medium">
                  Ngày tạo:
                </span>
                <span className="font-semibold text-[#1d2940] text-sm">
                  {invoice?.createdAt
                    ? dayjs(invoice.createAt).format("DD/MM/YYYY HH:mm")
                    : ""}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-dashed border-[#dfe6ef] max-sm:pt-2 pb-2 text-sm sm:text-base">
                <span className="text-[#71829e] text-sm font-medium">
                  Số người ở:
                </span>
                <span className="font-semibold text-[#1d2940] text-sm">
                  {invoice?.peopleCountSnapshot} người
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#71829e] text-sm font-medium">
                  Hạn nộp tiền:
                </span>
                <span className="font-semibold text-[#d94732] text-sm">
                  {formatDate(invoice?.toDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Chỉ số điện nước */}
          <div className="py-2">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#94A3B8]">
              Chỉ số điện nước
            </p>
            <div className="flex justify-start items-end w-full">
              <div className="grid max-sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-[#60728f]">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-[#fff3c7] text-[#D97706]">
                      <Zap className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-[#D97706] font-semibold">
                      Điện (kWh)
                    </span>
                  </div>
                  <div className="my-3">
                    {invoice?.newElectric ? (
                      <p className="text-2xl font-bold mt-1 flex items-center justify-start gap-4">
                        {invoice?.oldElectric}{" "}
                        <span>
                          <MoveRight className="size-4 text-[#94A3B8]" />
                        </span>{" "}
                        {invoice?.newElectric}
                      </p>
                    ) : (
                      <p className="text-2xl font-[900] mt-1 flex items-center justify-start gap-2">
                        {invoice?.oldElectric}{" "}
                        <span>
                          <MoveRight className="size-4 text-[#94A3B8]" />
                        </span>{" "}
                        <Input
                          type="number"
                          value={newElectricValue ?? ""}
                          onChange={(e) => {
                            setNewElectricValue(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            );
                          }}
                          className="max-w-[50%]! bg-white!"
                        />
                      </p>
                    )}
                  </div>
                  {/* {invoice?.newElectric ? ( */}
                  <p className="text-xs text-muted-foreground mt-2 border-t border-[#E2E8F0] pt-2">
                    Tiêu thụ:{" "}
                    <span className="font-bold text-[#1d2940]">
                      {(invoice?.newElectric || 0) -
                        (invoice?.oldElectric || 0)}{" "}
                      kWh
                    </span>
                  </p>
                  {/* ) : null} */}
                </div>

                <div className="bg-[#F8FAFC] border border-[#F1F5F9] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-[#60728f]">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-[#dff3ff] text-[#0284C7]">
                      <Droplets className="size-4" />
                    </span>
                    <span className="text-sm font-medium text-[#0284C7] font-semibold">
                      Nước (m³)
                    </span>
                  </div>
                  <div className="my-3">
                    {invoice?.newWater ? (
                      <p className="text-2xl font-bold mt-1 flex items-center justify-start gap-4">
                        {invoice?.oldWater}{" "}
                        <span>
                          <MoveRight className="size-4 text-[#94A3B8]" />
                        </span>{" "}
                        {invoice?.newWater}
                      </p>
                    ) : (
                      <p className="text-2xl font-[900] mt-1 flex items-center justify-start gap-2">
                        {invoice?.oldWater}{" "}
                        <span>
                          <MoveRight className="size-4 text-[#94A3B8]" />
                        </span>{" "}
                        <Input
                          type="number"
                          value={newWatercValue ?? ""}
                          onChange={(e) => {
                            setNewWaterValue(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            );
                          }}
                          className="max-w-[50%]! bg-white!"
                          min={0}
                        />
                      </p>
                    )}
                  </div>
                  {/* {invoice?.newWater ? ( */}
                  <p className="text-xs text-muted-foreground mt-2 border-t border-[#E2E8F0] pt-2">
                    Tiêu thụ:{" "}
                    <span className="font-bold text-[#1d2940]">
                      {(invoice?.newWater || 0) - (invoice?.oldWater || 0)} m³
                    </span>
                  </p>
                  {/* ) : null} */}
                </div>
              </div>
            </div>
          </div>

          {/* Các khoản thu */}
          <div className="py-2">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#94A3B8]">
              Các khoản thu
            </p>
            <div className="space-y-2 border-t border-[#e8eef5] pt-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#71829e] font-medium">
                  <span className="pr-2 text-[#CBD5E1] text-base">•</span>
                  Tiền phòng
                </span>
                <span className="text-sm font-medium">
                  {formatMoney(invoice?.rentAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-start text-sm text-[#71829e] font-medium">
                  <span className="pr-2 text-[#CBD5E1] text-base">•</span>
                  <div className="flex flex-col gap-1 max-sm:items-start max-sm:justify-start">
                    <span className="text-sm font-medium">Tiền dịch vụ</span>
                    <span className="text-[#94A3B8] text-xs">
                      Điện (3,5K) + Nước (7K) + Rác (10K)
                    </span>
                  </div>
                </span>
                <span className="text-sm font-medium">
                  {formatMoney(invoice?.serviceAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#71829e] font-medium">
                  <span className="pr-2 text-[#CBD5E1] text-base">•</span>Sổ ghi
                  nợ (tab)
                </span>
                <span className="text-sm font-medium">
                  {formatMoney(invoice?.tabAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#71829e] font-medium">
                  <span className="pr-2 text-[#CBD5E1] text-base">•</span>Nợ kỳ
                  trước
                </span>
                <span className="text-sm font-medium">
                  {formatMoney(invoice?.debtAmount)}
                </span>
              </div>
              <Separator />
              <div className="mt-4 space-y-3 rounded-[22px] bg-[#f7f9fc] p-5">
                <div className="flex justify-between font-semibold">
                  <span className="text-base">Tổng cộng</span>
                  <span className="text-lg font-extrabold">
                    {formatMoney(invoice?.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] text-sm font-medium">
                    Đã thanh toán
                  </span>
                  <span className="text-emerald-600 text-sm font-bold">
                    {formatMoney(invoice?.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] text-sm font-medium">
                    Còn lại phải thu
                  </span>
                  <span className="text-[#E11D48] text-lg font-extrabold">
                    {formatMoney(invoice?.totalAmount - invoice?.paidAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 border-t px-6 py-4 sm:px-8 bg-[#F8FAFC]">
          <InvoiceActionButtons
            status={invoice?.status}
            handlers={{
              onFinalize: () => mutation.mutate(),
              onRecordPayment: () => setPaymentModalOpen(true),
              onViewReceipt: () =>
                window.open(`/invoices/${invoice.id}/receipt`, "_blank"),
              onCancel: () => cancelMutation.mutate(),
            }}
            loading={{
              finalize: mutation.isPending,
            }}
          />
        </DialogFooter>
      </DialogContent>
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoiceId={invoiceId || 0}
        totalAmount={Number(invoice?.totalAmount || 0)}
        alreadyPaidAmount={Number(invoice?.paidAmount || 0)}
      />
    </Dialog>
  );
}
