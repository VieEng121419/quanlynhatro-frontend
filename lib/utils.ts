import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const InvoiceStatus = {
  DRAFT: "Nháp",
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Thanh toán một phần",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
} as const;

export type InvoiceStatusKey = keyof typeof InvoiceStatus;

export function getInvoiceStatusLabel(
  status: InvoiceStatusKey | string
): string {
  return InvoiceStatus[status as InvoiceStatusKey] || status;
}

export function getInvoiceStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return {
        bg: "bg-emerald-600",
        text: "text-white",
        label: "Đã thanh toán",
      };
    case "UNPAID":
      return { bg: "bg-red-600", text: "text-white", label: "Chưa thanh toán" };
    case "PARTIAL":
      return {
        bg: "bg-amber-500",
        text: "text-white",
        label: "Thanh toán một phần",
      };
    case "DRAFT":
      return { bg: "bg-zinc-500", text: "text-white", label: "Nháp" };
    case "CANCELLED":
      return { bg: "bg-zinc-400", text: "text-zinc-900", label: "Đã hủy" };
    default:
      return { bg: "bg-zinc-500", text: "text-white", label: status };
  }
}
