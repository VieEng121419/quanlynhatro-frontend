import { useMutation } from "@tanstack/react-query";
import type { LoginInput, LoginResponse } from "@/lib/types/auth.types";
import { axiosClient } from "@/lib/api/axios-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

async function login(input: LoginInput): Promise<LoginResponse> {
  const axiosRes = await axiosClient.post<LoginResponse>("/auth/login", input);
  return axiosRes as unknown as LoginResponse; // bóc thẳng { accessToken, user }
}

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      toast.success(res.message);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/rooms");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
