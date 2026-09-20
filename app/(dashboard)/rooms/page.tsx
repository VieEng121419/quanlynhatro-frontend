"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { DataTable, PaginationMeta } from "@/components/ui/data-table";
// import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Search,
  Table2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bolt, FileText, Receipt, FilePlus, Plus, QrCode } from "lucide-react";
import { BulkCreateModal } from "@/components/rooms/bulk-create-modal";
import { GenerateQrModal } from "@/components/rooms/generate-qr-modal";
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
import { RoomCardGrid } from "@/components/rooms/room-card-grid";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
  userId?: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  status: "EMPTY" | "OCCUPIED";
  branchId: number;
  contracts: RoomContract[];
}

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<string>("table");
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
  const [selectedRoomForQr, setSelectedRoomForQr] = useState<{
    id: number;
    roomNumber: string;
    userId: number;
  } | null>(null);

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
                    <DropdownMenuItem
                      onClick={() => handleGenerateQr(row)}
                      className="cursor-pointer"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      <span className="text-sm font-light">Tạo Mã QR</span>
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
    const savedViewMode = window.localStorage.getItem("rooms-view-mode");
    if (savedViewMode === "table" || savedViewMode === "card") {
      setViewMode(savedViewMode);
    } else if (window.matchMedia("(max-width: 767px)").matches) {
      setViewMode("card");
    }
  }, []);

  const handleViewModeChange = (nextViewMode: "table" | "card") => {
    setViewMode(nextViewMode);
    window.localStorage.setItem("rooms-view-mode", nextViewMode);
  };

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

  const handleGenerateQr = (room: Room) => {
    const activeContract = room.contracts?.find((c) => c.isActive);

    if (!activeContract?.userId) {
      toast.error("Phòng chưa có tài khoản người thuê!");
      return;
    }

    setSelectedRoomForQr({
      id: room.id,
      roomNumber: room.roomNumber,
      userId: activeContract.userId,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="max-sm:text-[20px] lg:text-3xl font-bold tracking-tight">
            Phòng Trọ
          </h1>
          <p className="text-muted-foreground max-sm:text-xs lg:text-sm mt-2">
            Quản lý danh sách phòng và tình trạng thuê
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Phòng Mới
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border border-[#D9D9D9] bg-background p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder="Tìm theo số phòng..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <select
              id="statusFilter"
              name="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="max-sm:w-[72%] h-[36px] rounded-button-input border border-[#E2E8F0] bg-[#FFFFFF] px-1 py-1 text-button-input focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tất cả trạng thái</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div
              className="flex justify-between items-center rounded-button-input border bg-muted p-0.5"
              aria-label="Chọn kiểu hiển thị"
            >
              <Button
                type="button"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className={
                  viewMode === "table"
                    ? "gap-2 rounded-lg bg-white"
                    : "gap-2 rounded-l-button-input"
                }
                onClick={() => handleViewModeChange("table")}
              >
                <Table2
                  className={
                    viewMode === "table" ? "h-4 w-4 text-[#E05338]" : "h-4 w-4"
                  }
                />
                <span className="hidden sm:inline text-button-input">Bảng</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="sm"
                className={
                  viewMode === "card"
                    ? "gap-2 rounded-lg bg-white"
                    : "gap-2 rounded-r-button-input"
                }
                onClick={() => handleViewModeChange("card")}
              >
                <Grid2X2
                  className={
                    viewMode === "card" ? "h-4 w-4 text-[#E05338]" : "h-4 w-4"
                  }
                />
                <span className="hidden sm:inline text-button-input">Thẻ</span>
              </Button>
            </div>
          </div>
        </div>
        {viewMode === "table" ? (
          <DataTable<Room>
            data={rooms}
            columns={columns}
            isLoading={isLoading}
            textNotFound="Không tìm thấy phòng nào"
          />
        ) : (
          <RoomCardGrid
            data={rooms}
            isLoading={isLoading}
            textNotFound="Không tìm thấy phòng nào"
            onCreateContract={handleCreateContract}
            onViewContract={handleViewContract}
            onViewInvoices={handleViewInvoices}
            onGenerateQr={handleGenerateQr}
          />
        )}
        {meta && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Hiển thị</span>
              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-input bg-[#EAEAEA] px-2 py-1 text-sm"
              >
                {[5, 10, 15, 20, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>trong tổng {meta.totalItems} phòng</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(meta.currentPage - 1)}
                disabled={meta.currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="rounded-md border px-3 py-1">
                {meta.currentPage} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(meta.currentPage + 1)}
                disabled={meta.currentPage >= meta.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

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

      <GenerateQrModal
        open={!!selectedRoomForQr}
        onOpenChange={() => setSelectedRoomForQr(null)}
        roomId={selectedRoomForQr?.id || 0}
        roomNumber={selectedRoomForQr?.roomNumber || ""}
        userId={selectedRoomForQr?.userId || 0}
      />
    </div>
  );
}
