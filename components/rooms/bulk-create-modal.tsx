"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BulkCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId?: number;
}

export function BulkCreateModal({
  open,
  onOpenChange,
  branchId = 1,
}: BulkCreateModalProps) {
  const [floorCount, setFloorCount] = useState(1);
  const [roomsPerFloor, setRoomsPerFloor] = useState(10);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      floorCount: number;
      roomsPerFloor: number;
      branchId: number;
    }) => {
      return axiosClient.post("/room/bulk", data);
    },
    onSuccess: () => {
      toast.success(`Tạo ${floorCount * roomsPerFloor} phòng thành công!`);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onOpenChange(false);
      // Reset form
      setFloorCount(1);
      setRoomsPerFloor(10);
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi khi tạo phòng hàng loạt");
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      floorCount,
      roomsPerFloor,
      branchId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Phòng Hàng Loạt</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tự động tạo phòng theo số tầng và số phòng mỗi tầng.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floorCount" className="text-right">
              Số Tầng
            </Label>
            <Input
              id="floorCount"
              type="number"
              min={1}
              value={floorCount}
              onChange={(e) => setFloorCount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomsPerFloor" className="text-right">
              Phòng/Tầng
            </Label>
            <Input
              id="roomsPerFloor"
              type="number"
              min={1}
              value={roomsPerFloor}
              onChange={(e) => setRoomsPerFloor(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Đang tạo..." : "Tạo Phòng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
