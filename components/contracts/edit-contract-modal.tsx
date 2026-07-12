"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CurrencyInput } from "../ui/currency-input";
import { ContractData } from "./view-contract-modal";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";
import dayjs from "dayjs";

const editContractSchema = z
  .object({
    tenantName: z.string().min(1, "Tên khách thuê không được để trống"),
    tenantPhone: z
      .string()
      .min(1, "Số điện thoại khách thuê không được để trống"),
    startDate: z
      .string()
      .min(1, "Ngày bắt đầu không được để trống"),
    //   .refine((date) => {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);
    //     const selected = new Date(date);
    //     return selected >= today;
    //   }, "Ngày bắt đầu không được ở quá khứ"),
    endDate: z.string().optional(),
    rentPrice: z.number().min(1, "Giá thuê phải lớn hơn 0"),
    depositAmount: z.number().min(1, "Tiền đặt cọc phải lớn hơn 0"),
    billingCycleDay: z
      .number()
      .min(1, "Ngày chốt sổ phải lớn hơn hoặc bằng 1")
      .max(31, "Ngày chốt sổ phải nhỏ hơn hoặc bằng 31"),
    activePeopleCount: z.number().optional(),
    basePeopleLimit: z.number().optional(),
    extraPersonFee: z.number().optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate || !data.startDate) return true;

      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      return end > start;
    },
    { message: "Ngày kết thúc phải sau ngày bắt đầu", path: ["endDate"] }
  );

type EditContractForm = z.infer<typeof editContractSchema>;

interface EditContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: ContractData | null;
}

export function EditContractModal({
  open,
  onOpenChange,
  contract,
}: EditContractModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<EditContractForm>({
    resolver: zodResolver(editContractSchema),
    defaultValues: {
      tenantName: contract?.tenantName || "",
      tenantPhone: contract?.tenantPhone || "",
      startDate: contract?.startDate ? contract.startDate.split("T")[0] : "",
      endDate: contract?.endDate ? contract.endDate.split("T")[0] : "",
      rentPrice: Number(contract?.rentPrice) || 0,
      depositAmount: Number(contract?.depositAmount) || 0,
      billingCycleDay: contract?.billingCycleDay || 5,
      activePeopleCount: contract?.activePeopleCount || 2,
      basePeopleLimit: contract?.basePeopleLimit || 2,
      extraPersonFee: Number(contract?.extraPersonFee) || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EditContractForm) =>
      axiosClient.put(`/contract/${contract?.id}`, data),
    onSuccess: () => {
      toast.success("Cập nhật hợp đồng thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["contract", contract?.id] });
      onOpenChange(false);
      reset();
    },
    onError: () => toast.error("Cập nhật thất bại"),
  });

  const onSubmit = (data: EditContractForm) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (contract && open) {
      reset({
        tenantName: contract.tenantName || "",
        tenantPhone: contract.tenantPhone || "",
        startDate: contract.startDate ? contract.startDate.split("T")[0] : "",
        endDate: contract.endDate ? contract.endDate.split("T")[0] : "",
        rentPrice: Number(contract.rentPrice) || 0,
        depositAmount: Number(contract.depositAmount) || 0,
        billingCycleDay: contract.billingCycleDay || 5,
        activePeopleCount: contract.activePeopleCount || 2,
        basePeopleLimit: contract.basePeopleLimit || 2,
        extraPersonFee: Number(contract.extraPersonFee) || 0,
      });
    }
  }, [contract, open, reset]);

  const handleClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "Bạn có chắc muốn hủy thay đổi? Dữ liệu sẽ không được lưu."
      );
      if (!confirmDiscard) return;
    }
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl gap-2">
            Chỉnh sửa hợp đồng
          </DialogTitle>
          <p className="text-base text-muted-foreground">
            Hợp đồng #{contract?.id}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Người thuê */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              NGƯỜI THUÊ
            </Label>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Tên người thuê</Label>
                <Input {...register("tenantName")} disabled={mutation.isPending} />
                {errors.tenantName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tenantName.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <Input {...register("tenantPhone")} disabled={mutation.isPending} />
                {errors.tenantPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tenantPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Thời hạn */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              THỜI HẠN
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input type="date" {...register("startDate")} min={dayjs().format("YYYY-MM-DD")} disabled={mutation.isPending} />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input type="date" {...register("endDate")} min={contract?.startDate} disabled={mutation.isPending} />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Label>Kỳ thanh toán (ngày trong tháng)</Label>
              <Input
                type="number"
                {...register("billingCycleDay", { valueAsNumber: true })}
                min={1}
                max={31}
                disabled={mutation.isPending}
              />
              {errors.billingCycleDay && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.billingCycleDay.message}
                </p>
              )}
            </div>
          </div>

          {/* Tài chính */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              TÀI CHÍNH
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label>Giá thuê (đ/tháng)</Label>
                <CurrencyInput
                  value={watch("rentPrice")}
                  onValueChange={(val) => setValue("rentPrice", val)}
                  disabled={mutation.isPending}
                />
                {errors.rentPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.rentPrice.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Tiền cọc (đ)</Label>
                <CurrencyInput
                  value={watch("depositAmount")}
                  onValueChange={(val) => setValue("depositAmount", val)}
                  disabled={mutation.isPending}
                />
                {errors.depositAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.depositAmount.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Phí người thêm (đ)</Label>
                <CurrencyInput
                  value={watch("extraPersonFee")}
                  onValueChange={(val) => setValue("extraPersonFee", val)}
                  disabled={mutation.isPending}
                />
                {errors.extraPersonFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.extraPersonFee.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              {isDirty ? "Hủy thay đổi" : "Đóng"}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || !isDirty}
            >
              {mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
              {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
