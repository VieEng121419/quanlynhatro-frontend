"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { DataTable, PaginationMeta } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Bolt, FileText, Receipt, FilePlus, Plus } from "lucide-react";
import { Plus } from "lucide-react";
import { BulkCreateModal } from "@/components/rooms/bulk-create-modal";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { CreateContractModal } from "@/components/contracts/create-contract-modal";
import {
  ContractData,
  ViewContractModal,
} from "@/components/contracts/view-contract-modal";
import { EditContractModal } from "@/components/contracts/edit-contract-modal";
import { DEFAULT_CONTRACT } from "@/lib/constants/constants";
import { InvoiceDetailModal } from "@/components/invoice/Invoice-detail-modal";
// import { toast } from "sonner";
// import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";
import dayjs from "dayjs";

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
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkModalAlreadyShown, setBulkModalAlreadyShown] = useState(false);
  const [selectedRoomForContract, setSelectedRoomForContract] = useState<{
    id: number;
    roomNumber: string;
  } | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );
  const [editingContract, setEditingContract] =
    useState<ContractData>(DEFAULT_CONTRACT);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );

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

  const roomsTab: RoomTab[] = data?.data || [];
  const meta: PaginationMeta | undefined = data?.data?.meta;

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
        return (
          <span>
            {Number(value).toLocaleString()}đ
          </span>
        );
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

  useEffect(() => {
    if (data?.data?.items?.length === 0) {
      setShowBulkModal(true);
    } else {
      setShowBulkModal(false);
    }
  }, [data, showBulkModal]);

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Phòng Mới
        </Button>
      </div>

      <DataTable<RoomTab>
        data={roomsTab}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        filterOptions={filterOptions}
        onFilterChange={setStatusFilter}
        textNotFound="Không tìm thấy công nợ nào"
      />

      <BulkCreateModal
        open={showBulkModal && !bulkModalAlreadyShown}
        onOpenChange={(status) => {
          setBulkModalAlreadyShown(true);
          setShowBulkModal(status);
        }}
      />

      <CreateContractModal
        open={!!selectedRoomForContract}
        onOpenChange={() => setSelectedRoomForContract(null)}
        roomId={selectedRoomForContract?.id || 0}
        roomNumber={selectedRoomForContract?.roomNumber || ""}
      />

      <ViewContractModal
        open={!!selectedContractId}
        onOpenChange={() => setSelectedContractId(null)}
        contractId={selectedContractId}
        onEdit={(contract: ContractData) => {
          setEditingContract(contract);
          setSelectedContractId(null);
        }}
      />

      <EditContractModal
        open={!!editingContract && !!editingContract.id}
        onOpenChange={() => setEditingContract(DEFAULT_CONTRACT)}
        contract={editingContract}
      />

      <InvoiceDetailModal
        open={!!selectedInvoiceId}
        onOpenChange={() => setSelectedInvoiceId(null)}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
}
