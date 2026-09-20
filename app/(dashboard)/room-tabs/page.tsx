"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Bolt, FileText, Receipt, FilePlus, Plus } from "lucide-react";
import { Plus } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";
import dayjs from "dayjs";
import { CreateRoomTabModal } from "@/components/room-tab/create-room-tab-modal";
import { Room } from "../rooms/page";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface RoomTab {
  id: number;
  roomId: number;
  status: "INVOICED" | "PENDING";
  description: string;
  amount: number;
  invoiceId: number;
  createdAt: string;
}

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["room-tabs", page, limit, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search); // hoặc roomNumber tùy BE
      if (statusFilter) params.append("status", statusFilter);

      const response = await axiosClient.get(`/room-tab?${params.toString()}`);
      return response;
    },
  });

  const { data: roomData } = useQuery({
    queryKey: ["rooms", page],
    queryFn: async () => {
      const res = await axiosClient.get(`/room?page=1&limit=100`);
      return res;
    },
  });

  const rooms: Room[] = roomData?.data?.items || [];

  const roomsTab: RoomTab[] = data?.data || [];
  const meta = data?.data?.meta;

  const columns: Column<RoomTab>[] = [
    {
      key: "roomId",
      header: "Mã Phòng",
      render: (value) => {
        return <span>{value}</span>;
      },
    },
    {
      key: "status",
      header: "Trạng Thái",
      render: (value) => {
        const status = value as "INVOICED" | "PENDING";
        return (
          <Badge
            className={
              status === "PENDING"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }
          >
            {status === "PENDING" ? "Chờ hoá đơn" : "Đã nhập vào hoá đơn"}
          </Badge>
        );
      },
    },
    {
      key: "description",
      header: "Mô tả",
      render: (value) => {
        return <span className="font-medium">{value}</span>;
      },
    },
    {
      key: "amount",
      header: "Giá tiền",
      render: (value) => {
        return <span>{Number(value).toLocaleString()}đ</span>;
      },
    },
    {
      key: "invoiceId",
      header: "Mã hoá đơn",
      render: (value) => {
        return value !== null ? <span>{value}</span> : <span>-</span>;
      },
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (value) => {
        return <span>{dayjs(value).format("DD/MM/YYYY HH:mm")}</span>;
      },
    },
    // {
    //   key: "id",
    //   header: "Thao Tác",
    //   render: (_, row: RoomTab) => {
    //     const isEmpty = row.status === "EMPTY";

    //     return (
    //       <div className="flex justify-end pr-5">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant="outline" size="sm" className="h-8 w-8 p-0">
    //               <Bolt className="h-4 w-4" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end">
    //             {isEmpty ? (
    //               <DropdownMenuItem
    //                 onClick={() => handleCreateContract(row)}
    //                 className="cursor-pointer"
    //               >
    //                 <FilePlus className="mr-2 h-4 w-4" />
    //                 <span className="text-sm font-light">Tạo Hợp Đồng</span>
    //               </DropdownMenuItem>
    //             ) : (
    //               <>
    //                 {/* <DropdownMenuItem
    //                   onClick={() => handleViewRoom(row)}
    //                   className="cursor-pointer"
    //                 >
    //                   <Eye className="mr-2 h-4 w-4" />
    //                   <span className="text-sm font-light">Chi Tiết Phòng</span>
    //                 </DropdownMenuItem> */}
    //                 <DropdownMenuItem
    //                   onClick={() => handleViewContract(row)}
    //                   className="cursor-pointer"
    //                 >
    //                   <FileText className="mr-2 h-4 w-4" />
    //                   <span className="text-sm font-light">Xem Hợp Đồng</span>
    //                 </DropdownMenuItem>
    //                 <DropdownMenuItem
    //                   onClick={() => handleViewInvoices(row)}
    //                   className="cursor-pointer"
    //                 >
    //                   <Receipt className="mr-2 h-4 w-4" />
    //                   <span className="text-sm font-light">Xem Hóa Đơn</span>
    //                 </DropdownMenuItem>
    //               </>
    //             )}
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     );
    //   },
    // },
  ];

  const filterOptions = [
    { label: "Chờ hoá đơn", value: "PENDING" },
    { label: "Đã nhập vào hoá đơn", value: "INVOICED" },
  ];

  //   const handleCreateContract = (room: RoomTab) => {
  //     setSelectedRoomForContract({ id: room.id, roomNumber: room.roomNumber });
  //   };

  // const handleViewRoom = (room: RoomTab) => {
  //   console.log("Xem chi tiết phòng:", room);
  //   // router.push(`/dashboard/rooms/${room.id}`);
  // };

  //   const handleViewContract = (room: RoomTab) => {
  //     const activeContract = room.contracts?.find((c) => c.isActive);
  //     if (activeContract?.id) {
  //       setSelectedContractId(activeContract.id);
  //     } else {
  //       // toast.error("Phòng này chưa có hợp đồng active");
  //     }
  //   };

  //   const handleViewInvoices = (room: RoomTab) => {
  //     const activeInvoiceId = room?.contracts[0]?.invoices[0]?.id || null;

  //     if (!activeInvoiceId) {
  //       toast.error("Phòng chưa có hoá đơn!");
  //       return;
  //     }

  //     setSelectedInvoiceId(activeInvoiceId);
  //   };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sổ Ghi Nợ</h1>
          <p className="text-muted-foreground mt-2">Quản lý danh sách nợ</p>
        </div>
        <Button onClick={() => setOpenCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Nợ Mới
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border border-[#D9D9D9] bg-background p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input placeholder="Tìm theo mã phòng..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-sm" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-md border border-input bg-[#EAEAEA] px-3 py-2 text-sm">
            <option value="">Tất cả trạng thái</option>
            {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <DataTable<RoomTab> data={roomsTab} columns={columns} isLoading={isLoading} textNotFound="Không tìm thấy công nợ nào" />
        {meta && <div className="flex items-center justify-end gap-2 text-sm"><span className="text-muted-foreground">{meta.currentPage} / {meta.totalPages}</span><Button variant="outline" size="sm" onClick={() => setPage(meta.currentPage - 1)} disabled={meta.currentPage <= 1}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="sm" onClick={() => setPage(meta.currentPage + 1)} disabled={meta.currentPage >= meta.totalPages}><ChevronRight className="h-4 w-4" /></Button></div>}
      </div>

      <CreateRoomTabModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        roomData={rooms}
      />
    </div>
  );
}
