export type InvoiceStatusKey =
  | "DRAFT"
  | "UNPAID"
  | "PARTIAL"
  | "PAID"
  | "CANCELLED";

export type InvoiceActionKey = "finalize" | "pay" | "receipt" | "cancel";

export interface InvoiceAction {
  key: InvoiceActionKey;
  label: string;
  variant?: "default" | "outline" | "destructive" | "ghost";
  role: "primary" | "secondary";
  requireConfirm?: boolean;
  confirmMessage?: string;
  onClick: () => void;
  isLoading?: boolean;
}

export interface InvoiceActionHandlers {
  onFinalize: () => void;
  onRecordPayment: () => void;
  onViewReceipt: () => void;
  onCancel: () => void;
}
