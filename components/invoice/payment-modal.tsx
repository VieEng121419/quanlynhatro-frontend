import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRecordPayment } from "@/hooks/useRecordPayment";
import { toast } from "sonner"; // hoặc lib toast bạn đang dùng
import z from "zod";
import { CurrencyInput } from "../ui/currency-input";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  totalAmount: number;
  alreadyPaidAmount: number; // paidAmount hiện tại của invoice, trước lần thu này
}

type PaymentFormValues = { amount: number };

export function PaymentModal({
  open,
  onClose,
  invoiceId,
  totalAmount,
  alreadyPaidAmount,
}: PaymentModalProps) {
  const remainingAmount = totalAmount - alreadyPaidAmount;
  const mutation = useRecordPayment(invoiceId);

  const schema = z.object({
    amount: z
      .number({ invalid_type_error: "Vui lòng nhập số tiền" })
      .positive("Số tiền phải lớn hơn 0")
      .max(
        remainingAmount,
        `Không được vượt quá số tiền còn lại (${remainingAmount.toLocaleString(
          "vi-VN"
        )}đ)`
      ),
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: remainingAmount }, // gợi ý sẵn thu đủ luôn
  });

  // reset lại form mỗi khi mở modal, tránh giữ giá trị lần trước
  useEffect(() => {
    if (open) reset({ amount: remainingAmount });
  }, [open, remainingAmount, reset]);

  const enteredAmount = watch("amount") || 0;
  const newTotalPaid = alreadyPaidAmount + enteredAmount;
  const willBeFullyPaid = newTotalPaid >= totalAmount;

  const onSubmit = (values: PaymentFormValues) => {
    const cumulativePaidAmount = alreadyPaidAmount + values.amount;

    mutation.mutate(
      {
        status: cumulativePaidAmount >= totalAmount ? "PAID" : "PARTIAL",
        paidAmount: Math.min(cumulativePaidAmount, totalAmount), // không vượt tổng
      },
      {
        onSuccess: () => {
          toast.success(
            willBeFullyPaid
              ? "Đã thanh toán đủ hoá đơn"
              : "Đã ghi nhận thanh toán một phần"
          );
          onClose();
        },
        onError: () => {
          toast.error("Ghi nhận thanh toán thất bại, vui lòng thử lại");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ghi nhận thanh toán</DialogTitle>
        </DialogHeader>

        <div className="space-y-1 text-sm text-muted-foreground mb-2">
          <div className="flex justify-between">
            <span>Tổng hoá đơn</span>
            <span>{totalAmount.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between">
            <span>Đã thanh toán</span>
            <span>{alreadyPaidAmount.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between font-medium text-foreground">
            <span>Còn lại</span>
            <span>{remainingAmount.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="amount">Số tiền thu lần này</Label>
            <CurrencyInput
              value={watch("amount")}
              max={totalAmount}
              onValueChange={(val) => {
                setValue("amount", val);
              }}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Sau khi thu, hoá đơn sẽ chuyển sang trạng thái:{" "}
            <span className="font-medium text-foreground">
              {willBeFullyPaid ? "Đã thanh toán" : "Thanh toán một phần"}
            </span>
          </p>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang xử lý..." : "Xác nhận thu tiền"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
