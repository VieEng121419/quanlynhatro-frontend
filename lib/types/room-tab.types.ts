export interface CreateRoomTabInput {
  roomId: number;
  description: string;
  amount: number;
}

export interface RoomTab {
  id: number;
  roomId: number;
  description: string;
  amount: string; // API trả string, cần Number() khi tính toán
  status: "PENDING" | "INVOICED";
  invoiceId: number | null;
  createdAt: string;
}

export interface CreateRoomTabResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RoomTab;
}
