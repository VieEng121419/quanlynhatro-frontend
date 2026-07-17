import type {
  InvoiceStatusKey,
  InvoiceAction,
  InvoiceActionHandlers,
  InvoiceActionKey,
} from "../types/invoice-action.types";

export function getInvoiceActions(
  status: InvoiceStatusKey,
  handlers: InvoiceActionHandlers,
  loading: Partial<Record<InvoiceActionKey, boolean>> = {}
): InvoiceAction[] {
  switch (status) {
    case "DRAFT":
      return [
        {
          key: "cancel",
          label: "Đóng",
          role: "secondary",
          variant: "ghost",
          requireConfirm: false,
          confirmMessage: "",
          onClick: handlers.onCancel,
        },
        {
          key: "finalize",
          label: "Chốt hoá đơn",
          role: "primary",
          onClick: handlers.onFinalize,
          isLoading: loading.finalize,
        },
      ];

    case "UNPAID":
      return [
        {
          key: "cancel",
          label: "Huỷ hoá đơn",
          role: "secondary",
          variant: "destructive",
          requireConfirm: true,
          confirmMessage: "Huỷ hoá đơn đã phát hành?",
          onClick: handlers.onCancel,
        },
        {
          key: "pay",
          label: "Ghi nhận thanh toán",
          role: "primary",
          onClick: handlers.onRecordPayment,
          isLoading: loading.pay,
        },
      ];

    case "PARTIAL":
      return [
        {
          key: "pay",
          label: "Thu thêm",
          role: "primary",
          onClick: handlers.onRecordPayment,
          isLoading: loading.pay,
        },
      ];

    case "PAID":
      return [
        {
          key: "receipt",
          label: "Xem biên nhận",
          role: "primary",
          variant: "outline",
          onClick: handlers.onViewReceipt,
        },
      ];

    case "CANCELLED":
      return [];

    default:
      return [];
  }
}
