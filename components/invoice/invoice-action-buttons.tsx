import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InvoiceAction,
  InvoiceActionHandlers,
  InvoiceStatusKey,
} from "@/lib/types/invoice-action.types";
import { getInvoiceActions } from "@/lib/configs/invoice-actions.config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Props {
  status: InvoiceStatusKey;
  handlers: InvoiceActionHandlers;
  loading?: Partial<Record<InvoiceAction["key"], boolean>>;
}

export function InvoiceActionButtons({
  status,
  handlers,
  loading = {},
}: Props) {
  const [pendingConfirm, setPendingConfirm] = useState<InvoiceAction | null>(
    null
  );

  const actions = getInvoiceActions(status, handlers, loading);

  const handleClick = (action: InvoiceAction) => {
    if (action.requireConfirm) {
      setPendingConfirm(action);
    } else {
      action.onClick();
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {actions.map((a) => (
          <Button
            key={a.key}
            className={cn(a.role === "primary" ? "flex-1" : "", a.key === "cancel" ? "text-[#E11D48] border-[#E11D48]/40" : "")}
            variant={a.variant}
            disabled={a.isLoading}
            size={"lg"}
            onClick={() => handleClick(a)}
          >
            {a.isLoading ? "Đang xử lý..." : a.label}
          </Button>
        ))}
      </div>

      <AlertDialog
        open={!!pendingConfirm}
        onOpenChange={(open) => !open && setPendingConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingConfirm?.confirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center items-center gap-2 flex-row!">
            <AlertDialogCancel className="m-0!" onClick={() => setPendingConfirm(null)}>
              Đóng
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pendingConfirm?.onClick();
                setPendingConfirm(null);
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
