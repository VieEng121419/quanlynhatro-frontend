"use client";

import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const { items, meta, loading, error, load, create } = useAdminNotifications(
    page,
    fromDate,
    toDate
  );

  const submit = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setSubmitting(true);
    setSuccess("");
    try {
      await create(form.title.trim(), form.message.trim());
      setOpen(false);
      setForm({ title: "", message: "" });
      setSuccess("Đã tạo thông báo cho tenant có hợp đồng đang hoạt động.");
      setPage(1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Thông báo</h1>
          <p className="text-muted-foreground">
            Lịch sử thông báo chung gửi đến khách thuê đang thuê phòng.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus /> Tạo thông báo
        </Button>
      </div>
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-3">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          aria-label="Từ ngày"
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          aria-label="Đến ngày"
        />
        <Button
          variant="outline"
          onClick={() => void load()}
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} /> Làm mới
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              {[
                "Tiêu đề",
                "Nội dung",
                "Tenant",
                "Số điện thoại",
                "Ngày tạo",
              ].map((x) => (
                <th key={x} className="p-3 text-left font-medium">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-muted-foreground"
                >
                  Chưa có thông báo.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="max-w-[280px] truncate p-3">{item.message}</td>
                  <td className="p-3">{item.user.fullName}</td>
                  <td className="p-3">{item.user.phoneNumber}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Tổng {meta.total} bản ghi
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => value - 1)}
          >
            Trước
          </Button>
          <span className="px-2 py-1 text-sm">
            {page} / {Math.max(1, meta.totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages || loading}
            onClick={() => setPage((value) => value + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thông báo chung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
              <Input
                maxLength={191}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nội dung</label>
              <textarea
                className="min-h-28 w-full rounded-md border bg-transparent p-3 text-sm"
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => void submit()}
              disabled={
                submitting || !form.title.trim() || !form.message.trim()
              }
            >
              {submitting ? "Đang gửi..." : "Gửi ngay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
