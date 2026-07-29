import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreateRoomTab } from "@/hooks/useCreateRoomTab";
import z from "zod";
import { Room } from "@/app/(dashboard)/rooms/page";
import { CurrencyInput } from "../ui/currency-input";

interface CreateRoomTabModalProps {
  open: boolean;
  onClose: () => void;
  roomData: Room[];
  defaultRoomId?: number; // nếu mở từ trang chi tiết phòng, truyền sẵn để ẩn dropdown
}

const createRoomTabShema = z.object({
  roomId: z.number({ invalid_type_error: "Vui lòng chọn phòng" }),
  description: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mô tả")
    .max(200, "Mô tả tối đa 200 ký tự"),
  amount: z
    .number({ invalid_type_error: "Vui lòng nhập số tiền" })
    .positive("Số tiền phải lớn hơn 0"),
});

type CreateRoomTabFormValues = z.infer<typeof createRoomTabShema>;

export function CreateRoomTabModal({
  open,
  onClose,
  roomData,
  defaultRoomId,
}: CreateRoomTabModalProps) {
  const mutation = useCreateRoomTab();

  const {
    watch,
    setValue,
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoomTabFormValues>({
    resolver: zodResolver(createRoomTabShema),
    defaultValues: {
      roomId: defaultRoomId ?? roomData[0]?.id,
      description: "",
      amount: undefined,
    },
  });

  // reset form mỗi lần mở modal, tránh giữ dữ liệu lần thêm trước
  useEffect(() => {
    if (open) {
      reset({
        roomId: defaultRoomId ?? roomData[0]?.id,
        description: "",
        amount: undefined,
      });
    }
  }, [open, defaultRoomId, roomData, reset]);

  const onSubmit = (values: CreateRoomTabFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm khoản ghi nợ</DialogTitle>
          <DialogDescription>
            Ghi nhận chi phí phát sinh cho phòng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Chỉ hiện dropdown chọn phòng nếu KHÔNG có defaultRoomId truyền sẵn */}
          {!defaultRoomId && (
            <div>
              <Label htmlFor="roomId">Phòng</Label>
              <Controller
                control={control}
                name="roomId"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger id="roomId" className="w-full">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomData.map((room) => (
                        <SelectItem key={room.id} value={String(room.id)}>
                          Phòng {room.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roomId && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.roomId.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="Ví dụ: 1 thùng bia đỏ"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Số tiền (đ)</Label>
            <CurrencyInput
              value={watch("amount")}
              onValueChange={(val) => setValue("amount", val)}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* <div className="bg-muted rounded-md px-3 py-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sẽ cộng vào tab của</span>
            <span className="font-medium">{roomId}</span>
          </div> */}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang xử lý..." : "Thêm khoản nợ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
