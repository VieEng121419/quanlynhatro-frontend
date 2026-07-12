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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import dayjs from "dayjs";
import { CurrencyInput } from "../ui/currency-input";
import { Spinner } from "../ui/spinner";

// Zod schema theo DTO
const createContractSchema = z
  .object({
    tenantName: z.string().min(1, "Tên khách thuê không được để trống"),
    tenantPhone: z
      .string()
      .min(1, "Số điện thoại khách thuê không được để trống"),
    startDate: z
      .string()
      .min(1, "Ngày bắt đầu không được để trống")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(date);
        return selected >= today;
      }, "Ngày bắt đầu không được ở quá khứ"),
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

type CreateContractForm = z.infer<typeof createContractSchema>;

interface CreateContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number;
  roomNumber: string;
}

export function CreateContractModal({
  open,
  onOpenChange,
  roomId,
  roomNumber,
}: CreateContractModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateContractForm>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      rentPrice: 0,
      depositAmount: 0,
      billingCycleDay: 5,
      activePeopleCount: 2,
      basePeopleLimit: 2,
      extraPersonFee: 0,
      startDate: dayjs().format("YYYY-MM-DD"),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateContractForm) =>
      axiosClient.post("/contract", { ...data, roomId }),
    onSuccess: () => {
      toast.success(`Tạo hợp đồng cho phòng ${roomNumber} thành công!`);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onOpenChange(false);
      reset();
    },
    onError: (err) => {
      toast.error(err?.message || "Tạo hợp đồng thất bại");
    },
  });

  const onSubmit = (data: CreateContractForm) => {
    mutation.mutate(data);
  };

  const onOpenChangeHandler = (isOpen: boolean) => {
    if (!isOpen) {
      console.log("ảo vl");
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Hợp Đồng - Phòng {roomNumber}</DialogTitle>
          <DialogDescription>
            Nhập thông tin khách thuê và điều khoản hợp đồng
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border-t pt-4"
        >
          <div>
            <Label>
              Tên Khách Thuê <span className="text-red-500">*</span>
            </Label>
            <Input {...register("tenantName")} placeholder="Nguyễn Văn A" disabled={mutation.isPending} />
            {errors.tenantName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tenantName.message}
              </p>
            )}
          </div>

          <div>
            <Label>
              Số Điện Thoại <span className="text-red-500">*</span>
            </Label>
            <Input {...register("tenantPhone")} placeholder="0901234567" disabled={mutation.isPending} />
            {errors.tenantPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tenantPhone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Ngày Bắt Đầu<span className="text-red-500">*</span>
              </Label>
              <Input type="date" {...register("startDate")} disabled={mutation.isPending} />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <Label>Ngày Kết Thúc</Label>
              <Input type="date" {...register("endDate")} disabled={mutation.isPending} />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Giá Thuê (tháng) <span className="text-red-500">*</span>
              </Label>
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
              <Label>
                Tiền Cọc <span className="text-red-500">*</span>
              </Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Ngày Chốt Tiền <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                max={31}
                {...register("billingCycleDay", { valueAsNumber: true })}
                disabled={mutation.isPending}
              />
              {errors.billingCycleDay && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.billingCycleDay.message}
                </p>
              )}
            </div>
            <div>
              <Label>Phí Người Thêm</Label>
              <CurrencyInput
                value={watch("extraPersonFee")}
                onValueChange={(val) => setValue("extraPersonFee", val)}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Số Người Hiện Tại</Label>
              <Input
                type="number"
                {...register("activePeopleCount", { valueAsNumber: true })}
                disabled={mutation.isPending}
              />
            </div>
            <div>
              <Label>Giới Hạn Người Cơ Bản</Label>
              <Input
                type="number"
                {...register("basePeopleLimit", { valueAsNumber: true })}
                disabled={mutation.isPending} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
              {mutation.isPending ? "Đang tạo..." : "Tạo Hợp Đồng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
