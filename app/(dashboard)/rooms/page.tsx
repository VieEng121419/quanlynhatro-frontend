"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { DataTable, PaginationMeta } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bolt, FileText, Receipt, FilePlus, Plus } from "lucide-react";
import { BulkCreateModal } from "@/components/rooms/bulk-create-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateContractModal } from "@/components/contracts/create-contract-modal";
import {
  ContractData,
  ViewContractModal,
} from "@/components/contracts/view-contract-modal";
import { EditContractModal } from "@/components/contracts/edit-contract-modal";
import { DEFAULT_CONTRACT } from "@/lib/constants/constants";
import { InvoiceDetailModal } from "@/components/invoice/Invoice-detail-modal";
import { toast } from "sonner";
import { getInvoiceStatusLabel, getInvoiceStatusStyle } from "@/lib/utils";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface ContractInvoice {
  id: number;
  totalAmount?: string | number;
  createdAt?: string | Date;
  peopleCountSnapshot?: number;
  status: string;
}

interface RoomContract {
  id: number;
  tenantName?: string;
  rentPrice?: string;
  isActive: boolean;
  invoices: ContractInvoice[];
  activePeopleCount?: number;
}

interface Room {
  id: number;
  roomNumber: string;
  status: "EMPTY" | "OCCUPIED";
  branchId: number;
  contracts: RoomContract[];
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
    queryKey: ["rooms", page, limit, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search); // hoặc roomNumber tùy BE
      if (statusFilter) params.append("status", statusFilter);

      const response = await axiosClient.get(`/room?${params.toString()}`);
      return response;
    },
  });

  const rooms: Room[] = data?.data?.items || [];
  const meta: PaginationMeta | undefined = data?.data?.meta;

  const columns: Column<Room>[] = [
    {
      key: "roomNumber",
      header: "Số Phòng",
    },
    {
      key: "status",
      header: "Trạng Thái",
      render: (value) => {
        const status = value as "EMPTY" | "OCCUPIED";
        return (
          <Badge
            className={
              status === "EMPTY"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }
          >
            {status === "EMPTY" ? "Trống" : "Đang Thuê"}
          </Badge>
        );
      },
    },
    {
      key: "contracts",
      header: "Giá phòng",
      render: (value) => {
        const contracts = value as RoomContract[] | undefined;
        const activeContract = contracts?.find((c) => c.isActive);
        return activeContract?.rentPrice ? (
          `${Number(activeContract.rentPrice).toLocaleString()}đ`
        ) : (
          <span className="text-muted-foreground italic">Chưa có khách</span>
        );
      },
    },
    {
      key: "contracts",
      header: "Số Người",
      render: (value) => {
        const contracts = value as RoomContract[];
        const activeContract = contracts?.find((c) => c.isActive);
        const latestInvoice = activeContract?.invoices?.[0];

        const peopleCount =
          latestInvoice?.peopleCountSnapshot ??
          activeContract?.activePeopleCount;

        return peopleCount !== undefined ? (
          <span className="font-medium">{peopleCount} người</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: "contracts",
      header: "Hóa Đơn Gần Nhất",
      render: (value) => {
        const contracts = value as RoomContract[] | undefined;
        const activeContract = contracts?.find((c) => c.isActive);
        const latestInvoice = activeContract?.invoices?.[0];

        if (!latestInvoice?.totalAmount) {
          return <span className="text-muted-foreground">-</span>;
        }

        const amount = latestInvoice?.totalAmount;
        const createdAt = latestInvoice?.createdAt
          ? new Date(latestInvoice?.createdAt)
          : null;
        const monthStr = createdAt
          ? `Tháng ${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`
          : "";

        return (
          <div>
            <div className="font-medium">{`${Number(
              amount
            ).toLocaleString()}đ`}</div>
            {monthStr && (
              <div className="text-xs text-muted-foreground">{monthStr}</div>
            )}
          </div>
        );
      },
    },
    {
      key: "contracts",
      header: "Trạng Thái Hoá Đơn",
      render: (value) => {
        const contracts = value as RoomContract[] | undefined;
        const activeContract = contracts?.find((c) => c.isActive);
        const latestInvoice = activeContract?.invoices?.[0];

        if (!latestInvoice?.totalAmount) {
          return <span className="text-muted-foreground">-</span>;
        }

        const status = latestInvoice?.status;
        const style = getInvoiceStatusStyle(status);

        return (
          <div>
            <Badge
              className={`${style.bg} ${style.text} py-1 px-3 rounded-full text-xs font-semibold`}
            >
              {getInvoiceStatusLabel(status)}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "id",
      header: "Thao Tác",
      render: (_, row: Room) => {
        const isEmpty = row.status === "EMPTY";

        return (
          <div className="flex justify-end pr-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Bolt className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isEmpty ? (
                  <DropdownMenuItem
                    onClick={() => handleCreateContract(row)}
                    className="cursor-pointer"
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    <span className="text-sm font-light">Tạo Hợp Đồng</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    {/* <DropdownMenuItem
                      onClick={() => handleViewRoom(row)}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span className="text-sm font-light">Chi Tiết Phòng</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={() => handleViewContract(row)}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="text-sm font-light">Xem Hợp Đồng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewInvoices(row)}
                      className="cursor-pointer"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      <span className="text-sm font-light">Xem Hóa Đơn</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const filterOptions = [
    { label: "Trống", value: "EMPTY" },
    { label: "Đang Thuê", value: "OCCUPIED" },
    { label: "Bảo Trì", value: "MAINTENANCE" },
  ];

  useEffect(() => {
    if (data?.data?.items?.length === 0) {
      setShowBulkModal(true);
    } else {
      setShowBulkModal(false);
    }
  }, [data, showBulkModal]);

  const handleCreateContract = (room: Room) => {
    setSelectedRoomForContract({ id: room.id, roomNumber: room.roomNumber });
  };

  // const handleViewRoom = (room: Room) => {
  //   console.log("Xem chi tiết phòng:", room);
  //   // router.push(`/dashboard/rooms/${room.id}`);
  // };

  const handleViewContract = (room: Room) => {
    const activeContract = room.contracts?.find((c) => c.isActive);
    if (activeContract?.id) {
      setSelectedContractId(activeContract.id);
    } else {
      // toast.error("Phòng này chưa có hợp đồng active");
    }
  };

  const handleViewInvoices = (room: Room) => {
    const activeInvoiceId = room?.contracts[0]?.invoices[0]?.id || null;

    if (!activeInvoiceId) {
      toast.error("Phòng chưa có hoá đơn!");
      return;
    }

    setSelectedInvoiceId(activeInvoiceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phòng Trọ</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý danh sách phòng và tình trạng thuê
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Phòng Mới
        </Button>
      </div>

      <DataTable<Room>
        data={rooms}
        columns={columns}
        meta={meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        filterOptions={filterOptions}
        onFilterChange={setStatusFilter}
        textNotFound="Không tìm thấy phòng nào"
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
