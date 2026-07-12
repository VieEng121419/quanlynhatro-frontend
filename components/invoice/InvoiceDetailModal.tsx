"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";
import dayjs from "dayjs";
import { Droplet, Zap } from "lucide-react";

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
  const { data } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => axiosClient.get(`/invoice/${invoiceId}`),
    enabled: !!invoiceId && open,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Hóa đơn phòng {invoice?.id}</DialogTitle>
              <p className="text-sm text-muted-foreground flex justify-start items-center pt-1">
                Hợp đồng #{invoice?.contractId}
              </p>
            </div>
            <Badge
              className={`${style.bg} ${style.text} py-1 px-3 rounded-full text-xs font-semibold`}
            >
              {getInvoiceStatusLabel(invoice?.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-2">
          {/* Kỳ tính */}
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Kỳ tính</p>
            <p className="font-medium text-sm">
              {formatDate(invoice?.fromDate)} - {formatDate(invoice?.toDate)}
            </p>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Số người ở</span>
            <span className="text-sm">
              {invoice?.peopleCountSnapshot} người
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Ngày tạo</span>
            <span className="text-sm">
              {invoice?.createdAt
                ? dayjs(invoice?.createAt).format("DD/MM/YYYY HH:mm")
                : ""}
            </span>
          </div>

          <Separator />

          {/* Chỉ số điện nước */}
          <div className="py-2">
            <p className="text-xs font-medium mb-3">CHỈ SỐ ĐIỆN NƯỚC</p>
            <div className="flex justify-start items-end w-full">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-[10%] text-muted-foreground" />
                    <span className="text-xs">Điện (kWh)</span>
                  </div>
                  <p className="text-2xl font-semibold mt-1">
                    {invoice?.oldElectric} → {invoice?.newElectric}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tiêu thụ:{" "}
                    {(invoice?.newElectric || 0) - (invoice?.oldElectric || 0)}{" "}
                    kWh
                  </p>
                </div>

                <div className="bg-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-[10%] text-muted-foreground" />
                    <span className="text-xs">Nước (m³)</span>
                  </div>
                  <p className="text-2xl font-semibold mt-1">
                    {invoice?.oldWater} → {invoice?.newWater}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tiêu thụ:{" "}
                    {(invoice?.newWater || 0) - (invoice?.oldWater || 0)} m³
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Các khoản thu */}
          <div className="py-2">
            <p className="text-xs font-medium mb-3">CÁC KHOẢN THU</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tiền phòng</span>
                <span className="text-sm">{formatMoney(invoice?.rentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tiền dịch vụ</span>
                <span className="text-sm">{formatMoney(invoice?.serviceAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sổ ghi nợ (tab)</span>
                <span className="text-sm">{formatMoney(invoice?.tabAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nợ kỳ trước</span>
                <span className="text-sm">{formatMoney(invoice?.debtAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-sm">Tổng cộng</span>
                <span className="text-sm">{formatMoney(invoice?.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Đã thanh toán</span>
                <span className="text-emerald-600 text-sm">
                  {formatMoney(invoice?.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Còn lại phải thu</span>
                <span className="text-red-400 text-sm">
                  {formatMoney(invoice?.paidAmount - invoice?.paidAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
          <Button className="flex-1">Phát hành hóa đơn</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
