"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GenerateQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number;
  roomNumber: string;
  userId: number;
}

interface QrResponse {
  qrCode: string;
  qrImage: string;
  room: {
    id: number;
    roomNumber: string;
  };
  user: {
    id: number;
    userName: string;
    fullName: string;
  };
}

export function GenerateQrModal({
  open,
  onOpenChange,
  roomId,
  roomNumber,
  userId,
}: GenerateQrModalProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post("/auth/generate-qr", {
        roomId,
        userId,
      });
      return response.data as QrResponse;
    },
    onError: () => {
      toast.error("Tạo mã QR thất bại, vui lòng thử lại!");
    },
  });

  const qrData = mutation.data;

  const handleDownload = () => {
    if (!qrData?.qrImage) return;

    const link = document.createElement("a");
    link.href = qrData.qrImage;
    link.download = `qr-phong-${roomNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Mã QR Phòng {roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {mutation.isPending ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Đang tạo mã QR...
              </p>
            </div>
          ) : qrData ? (
            <>
              {/* QR Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrData.qrImage}
                  alt={`QR Code phòng ${roomNumber}`}
                  className="w-56 h-56 object-contain"
                />
              </div>

              {/* Thông tin người thuê */}
              <div className="w-full space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phòng</span>
                  <span className="font-medium">{qrData.room.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người thuê</span>
                  <span className="font-medium">
                    {qrData.user.fullName || qrData.user.userName}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <QrCode className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Nhấn nút bên dưới để tạo mã QR cho phòng {roomNumber}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {!qrData && !mutation.isPending && (
            <Button
              className="flex-1"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Tạo Mã QR
            </Button>
          )}

          {qrData && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Tải Xuống
            </Button>
          )}

          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}