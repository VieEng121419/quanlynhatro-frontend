"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Home, User } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";

const formSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(1, { message: "Username không được để trống." }),
  password: z.string().min(5, {
    message: "Mật khẩu không được để trống.",
  }),
});

export default function LoginPage() {
  const mutation = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Home className="mx-auto h-12 w-12 text-gray-400" />
        <CardTitle className="mt-4 text-2xl">Nhà trọ Tuấn Việt</CardTitle>
        <CardDescription>Website quản lý nhà trọ</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đặng nhập</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tên đăng nhập"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <div className="text-center text-sm">
          Không có tài khoản?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Liên hệ admin
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
