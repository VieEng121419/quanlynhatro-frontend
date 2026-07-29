import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/api/axios-client";
import {
  CreateRoomTabInput,
  CreateRoomTabResponse,
} from "@/lib/types/room-tab.types";
import { toast } from "sonner";

export function useCreateRoomTab() {
  const qc = useQueryClient();

  return useMutation<CreateRoomTabResponse, Error, CreateRoomTabInput>({
    mutationFn: async (input: CreateRoomTabInput) => {
      const axiosResponse = await axiosClient.post<CreateRoomTabResponse>(
        "/room-tab",
        input
      );
      return axiosResponse as unknown as CreateRoomTabResponse;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["room-tabs"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
