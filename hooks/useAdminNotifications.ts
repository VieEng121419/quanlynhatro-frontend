import { useCallback, useEffect, useState } from "react";
import { axiosClient } from "@/lib/api/axios-client";

type Recipient = { id: number; fullName: string; phoneNumber: string };
export type AdminNotification = {
  id: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  user: Recipient;
};
type History = {
  items: AdminNotification[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

function unwrap<T>(value: T | { data: T }): T {
  return value && typeof value === "object" && "data" in value
    ? value.data
    : value;
}

export function useAdminNotifications(
  page: number,
  fromDate: string,
  toDate: string
) {
  const [history, setHistory] = useState<History>({
    items: [],
    meta: { total: 0, page, limit: 10, totalPages: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", `${toDate}T23:59:59.999Z`);
      setHistory(
        unwrap(
          await axiosClient.get<History>(
            `/notification/admin/history?${params}`
          )
        )
      );
    } catch {
      setError("Không thể tải lịch sử thông báo.");
    } finally {
      setLoading(false);
    }
  }, [fromDate, page, toDate]);
  useEffect(() => {
    void load();
  }, [load]);
  const create = async (title: string, message: string) => {
    await axiosClient.post("/notification/admin/general", { title, message });
    await load();
  };
  return { ...history, loading, error, load, create };
}
