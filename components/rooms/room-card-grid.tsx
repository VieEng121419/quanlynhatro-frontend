"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bolt,
  FileText,
  QrCode,
  Receipt,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";
import type { Room } from "@/app/(dashboard)/rooms/page";

interface RoomCardGridProps {
  data: Room[];
  isLoading: boolean;
  textNotFound: string;
  onCreateContract: (room: Room) => void;
  onViewContract: (room: Room) => void;
  onViewInvoices: (room: Room) => void;
  onGenerateQr: (room: Room) => void;
}

export function RoomCardGrid({
  data,
  isLoading,
  textNotFound,
  onCreateContract,
  onViewContract,
  onViewInvoices,
  onGenerateQr,
}: RoomCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="gap-3">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border py-12 text-center text-muted-foreground">
        {textNotFound}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((room) => {
        const activeContract = room.contracts?.find(
          (contract) => contract.isActive
        );
        const latestInvoice = activeContract?.invoices?.[0];
        const peopleCount =
          latestInvoice?.peopleCountSnapshot ??
          activeContract?.activePeopleCount;
        const invoiceStyle = latestInvoice
          ? getInvoiceStatusStyle(latestInvoice.status)
          : null;

        return (
          <Card key={room.id} className="h-full gap-0 overflow-hidden">
            <CardHeader className="flex items-center justify-between gap-3 border-b bg-muted/20 pb-4">
              <CardTitle className="text-base">
                Phòng {room.roomNumber}
              </CardTitle>
              <Badge
                className={
                  room.status === "EMPTY"
                    ? "bg-red-100 text-red-700 font-semibold"
                    : "bg-green-100 text-green-700 font-semibold"
                }
              >
                {room.status === "EMPTY" ? "Trống" : "Đang Thuê"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 py-5">
              <div className="grid grid-cols-2 gap-4 text-sm bg-[#F8FAFC] p-3 rounded-lg">
                <div>
                  <p className="text-muted-foreground text-xs">Giá phòng</p>
                  <p className="mt-1 font-semibold">
                    {activeContract?.rentPrice
                      ? `${Number(activeContract.rentPrice).toLocaleString()}đ`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Người thuê</p>
                  <p className="mt-1 font-semibold">
                    {activeContract?.tenantName || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] p-3 rounded-lg">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">Số người:</span>
                <span className="font-medium">
                  {peopleCount !== undefined ? `${peopleCount} người` : "-"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm bg-[#F8FAFC] p-3 rounded-lg">
                <WalletCards className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between items-center gap-1 w-full">
                  <div>
                    {" "}
                    <p className="text-muted-foreground text-xs">Hóa đơn gần nhất</p>
                    {latestInvoice?.totalAmount ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          {Number(latestInvoice.totalAmount).toLocaleString()}đ
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-muted-foreground">-</p>
                    )}
                  </div>

                  {invoiceStyle && (
                    <Badge
                      className={`${invoiceStyle.bg} ${invoiceStyle.text} rounded-full text-xs`}
                    >
                      {latestInvoice?.totalAmount
                        ? getInvoiceStatusLabel(latestInvoice.status)
                        : "-"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 pt-4! px-4 text-xs text-muted-foreground">
              {room.status === "EMPTY" ? (
                <Button
                  variant="outline"
                  className="w-full p-0"
                  onClick={() => onCreateContract(room)}
                >
                  <UserPlus className="h-4 w-4" />
                  <p className="font-medium text-[12px]">Tạo hợp đồng</p>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full p-0">
                      <Bolt className="h-4 w-4" />
                      <p className="font-medium text-[12px]">Chi tiết</p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <>
                      <DropdownMenuItem
                        onClick={() => onViewContract(room)}
                        className="cursor-pointer"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Xem Hợp Đồng
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onViewInvoices(room)}
                        className="cursor-pointer"
                      >
                        <Receipt className="mr-2 h-4 w-4" /> Xem Hóa Đơn
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onGenerateQr(room)}
                        className="cursor-pointer"
                      >
                        <QrCode className="mr-2 h-4 w-4" /> Tạo Mã QR
                      </DropdownMenuItem>
                    </>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
