"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Calendar, Phone, Users } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "@/lib/types/types";

export interface ContractData {
  id: number | null;
  roomId: number | null;
  tenantName: string;
  tenantPhone: string;
  startDate: string;
  endDate?: string;
  rentPrice: number;
  depositAmount: number;
  billingCycleDay: number;
  activePeopleCount?: number;
  basePeopleLimit?: number;
  extraPersonFee?: number;
  isActive: boolean;
  room?: {
    id: number;
    roomNumber: string;
  };
}

interface ViewContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number | null;
  onEdit?: (contract: ContractData) => void;
}

export function ViewContractModal({
  open,
  onOpenChange,
  contractId,
  onEdit,
}: ViewContractModalProps) {
  const [approveTerminate, setApproveTerminate] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => axiosClient.get(`/contract/${contractId}`),
    enabled: !!contractId && open,
  });

  const contract = data?.data;

  const mutation = useMutation({
    mutationFn: (id: number) =>
      axiosClient.post(`/contract/${id}/terminate`, {
        finalElectric: contract.invoices[0]?.newElectric || 0,
        finalWater: contract.invoices[0]?.newWater || 0,
      }),
    onSuccess: () => {
      toast.success("Hợp đồng đã được kết thúc thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["contract", contract?.id] });
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error("Kết thúc hợp đồng thất bại: " + error.message);
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatMoney = (amount?: string | number) => {
    if (!amount) return "0 đ";
    return Number(amount).toLocaleString("vi-VN") + " đ";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setApproveTerminate(false);
        onOpenChange(false);
      }}
    >
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                Hợp đồng phòng {contract?.room?.roomNumber}
              </DialogTitle>
              <p className="text-muted-foreground text-base">
                Mã hợp đồng #{contract?.id}
              </p>
            </div>
            <Badge
              className={`${
                contract?.isActive
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              } py-1 px-3 rounded-full text-xs font-semibold`}
            >
              {contract?.isActive ? "Đang hiệu lực" : "Đã kết thúc"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Người thuê */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
              {contract?.tenantName?.[0] || "K"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base">{contract?.tenantName}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {contract?.tenantPhone}
              </p>
            </div>
          </div>

          <Separator />

          {/* Thời hạn */}
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Thời hạn hợp đồng</span>
            </div>
            <p className="font-medium text-sm">
              {formatDate(contract?.startDate)} —{" "}
              {formatDate(contract?.endDate)}
            </p>
          </div>

          <Separator />

          {/* Chi tiết tài chính */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Giá thuê</span>
              <span className="font-semibold text-sm">
                {formatMoney(contract?.rentPrice)}/tháng
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Tiền cọc</span>
              <span className="font-semibold text-sm">
                {formatMoney(contract?.depositAmount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Kỳ thanh toán
              </span>
              <span className="text-sm">
                Ngày {contract?.billingCycleDay} hàng tháng
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" /> Số người
              </span>
              <span className="text-sm">
                {contract?.activePeopleCount || 0} /{" "}
                {contract?.basePeopleLimit || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Phụ phí thêm người
              </span>
              <span className="text-sm">
                {formatMoney(contract?.extraPersonFee)} /người
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
              setApproveTerminate(false);
            }}
          >
            Đóng
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onEdit?.(contract); // hoặc set state từ parent
              onOpenChange(false); // đóng view modal
            }}
            disabled={!contract?.isActive}
          >
            Chỉnh sửa hợp đồng
          </Button>
          {!approveTerminate && (
            <Button
              className="flex-1 bg-red-100! text-red-500! "
              onClick={() => {
                setApproveTerminate(true);
              }}
              disabled={!contract?.isActive || mutation.isPending}
            >
              {mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
              {contract?.isActive
                ? "Kết thúc hợp đồng"
                : "Hợp đồng đã kết thúc"}
            </Button>
          )}
          {approveTerminate && contract?.isActive ? (
            <Button
              className="flex-1 bg-[#f59e0b]! text-white! hover:bg-[#d97706]! "
              onClick={() => {
                setApproveTerminate(false);
                mutation.mutate(contract.id);
                console.log("huỷ HD");
              }}
            >
              Xác nhận kết thúc
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
