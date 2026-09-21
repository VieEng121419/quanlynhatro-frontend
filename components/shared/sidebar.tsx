"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  CreditCard,
  NotebookTabs,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const sidebarGroups = [
  {
    title: "Quản Lý",
    items: [
      {
        title: "Tổng quan",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Phòng Trọ",
        href: "/rooms",
        icon: Home,
        badge: null,
      },
      {
        title: "Hợp Đồng",
        href: "/contracts",
        icon: FileText,
        badge: null,
      },
      {
        title: "Hóa Đơn",
        href: "/invoices",
        icon: CreditCard,
        badge: null,
      },
      {
        title: "Sổ Ghi Nợ",
        href: "/room-tabs",
        icon: NotebookTabs,
        badge: null,
      },
      {
        title: "Thông báo",
        href: "/notifications",
        icon: Bell,
        badge: null,
      },
    ],
  },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  // State duy nhất:
  // - false: Desktop mở rộng (w-72), Mobile ẩn (dịch trái -translate-x-full)
  // - true: Desktop thu gọn (w-16), Mobile hiện diện (translate-x-0)
  const [isToggled, setIsToggled] = useState(false);

  const handleLinkClick = () => {
    // Tự động đóng sidebar trên mobile khi click vào link.
    // Việc gọi window.innerWidth bên trong event handler là an toàn 100%
    // vì nó chỉ chạy khi người dùng thao tác (sau khi đã hydrate xong).
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsToggled(false);
    }
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* 1. NÚT HAMBURGER NỔI DÀNH CHO MOBILE (Chỉ hiện khi Sidebar đang đóng) */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-40 bg-white border shadow-sm rounded-full md:hidden",
          isToggled ? "hidden" : "flex"
        )}
        onClick={() => setIsToggled(true)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* 2. LỚP OVERLAY TỐI MÀU (Chỉ dành cho Mobile khi mở Sidebar) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-xs backdrop-grayscale md:hidden transition-opacity duration-300",
          isToggled
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsToggled(false)}
      />

      {/* 3. SIDEBAR CONTAINER */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 flex h-full flex-col bg-[#DEDEDE] border-r shadow-sm transition-all duration-300",
          // Style của Desktop (md: >= 768px)
          isToggled ? "md:w-16 md:p-1" : "md:w-72 md:px-6 md:py-2",
          // Style của Mobile (max-md: < 768px)
          "max-md:w-72 max-md:px-6 max-md:py-2",
          isToggled ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* HEADER / LOGO */}
        <div className="relative px-2 py-2 min-h-[64px] flex items-center">
          {/* Logo Đầy Đủ (Hiện khi Desktop mở rộng, luôn hiện trên Mobile) */}
          <Link
            href="/dashboard"
            className={cn(
              "items-center gap-3 group w-full",
              isToggled ? "md:hidden flex" : "flex"
            )}
          >
            <Image
              src="/nhatrotuanviet-logo.png"
              alt="Nhà trọ Tuấn Việt"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold group-hover:text-primary transition-colors whitespace-nowrap">
                Quản Lý Trọ
              </span>
              <span className="text-[#4B5563] text-[11px] font-medium">
                NHÀ TRỌ TUẤN VIỆT
              </span>
            </div>
          </Link>

          {/* Logo Thu Gọn (Chỉ hiện khi Desktop thu gọn, giấu trên Mobile) */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg items-center justify-center mx-auto",
              isToggled ? "md:flex hidden" : "hidden"
            )}
          >
            <Image
              src="/nhatrotuanviet-logo.png"
              alt="Nhà trọ Tuấn Việt"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain"
            />
          </div>

          {/* NÚT TOGGLE NẰM TRÊN VIỀN SIDEBAR */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 hover:bg-muted h-8 w-8 rounded-full border bg-white z-50 shadow-sm",
              // Desktop: Lệch ra ngoài khi thu gọn, nằm viền giữa khi mở rộng
              isToggled
                ? "md:-right-4 md:translate-x-full"
                : "md:right-0 md:translate-x-1/2",
              // Mobile: Luôn nằm ở viền phải để đóng lại
              "max-md:right-0 max-md:translate-x-1/2"
            )}
            onClick={() => setIsToggled(!isToggled)}
          >
            {/* Logic xoay chiều Icon bằng CSS */}
            <ChevronRight
              className={cn(
                "h-4 w-4",
                isToggled ? "hidden md:block" : "hidden"
              )}
            />
            <ChevronLeft
              className={cn("h-4 w-4", isToggled ? "block md:hidden" : "block")}
            />
          </Button>
        </div>

        {/* DANH SÁCH MENU */}
        <nav className="flex-1 space-y-8 overflow-y-auto overflow-x-hidden mt-4 pb-4">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              {/* Tiêu đề mục (Quản lý, Hệ thống...) */}
              <h3
                className={cn(
                  "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 whitespace-nowrap",
                  isToggled ? "md:hidden block" : "block"
                )}
              >
                {group.title}
              </h3>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      title={isToggled ? item.title : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-muted relative",
                        // Căn chỉnh chữ và padding (Icon thu gọn căn giữa)
                        isToggled
                          ? "md:justify-center md:px-3 md:py-4 px-3 py-3 justify-start"
                          : "justify-start px-3 py-3",
                        // Trạng thái đang chọn
                        isActive
                          ? "bg-[#E15D3A] text-primary-foreground shadow-md hover:bg-[#E15D3A]/90 font-semibold"
                          : "text-[#4B5563] hover:text-foreground font-semibold"
                      )}
                    >
                      <Icon
                        className={cn(
                          "transition-all duration-200 shrink-0",
                          isToggled ? "md:h-5 md:w-5 h-4 w-4" : "h-4 w-4",
                          isActive && isToggled && "md:text-white text-white"
                        )}
                      />
                      <span
                        className={cn(
                          "whitespace-nowrap group-hover:translate-x-0.5 transition-transform duration-200 text-sm",
                          isToggled ? "md:hidden block" : "block"
                        )}
                      >
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
