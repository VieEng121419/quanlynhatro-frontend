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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarGroups = [
  {
    title: "Tổng Quan",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      }
    ],
  },
  {
    title: "Quản Lý",
    items: [
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
    ],
  }
//   {
//     title: "Khác",
//     items: [
//       {
//         title: "Cài Đặt",
//         href: "/dashboard/settings",
//         icon: Settings,
//         badge: null,
//       },
//     ],
//   },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card shadow-sm transition-all duration-300 relative bg-[#DEDEDE]",
        isCollapsed ? "w-16 p-1" : "w-72 px-6 py-2"
      )}
    >
      {/* Logo */}
      <div className="border-b px-2 p-2 relative">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#E15D3A] flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold group-hover:text-primary transition-colors">
              Quản Lý Trọ
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={` h-8 w-8 hover:bg-muted absolute ${!isCollapsed ? "top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2" : "top-1/2 -right-10 transform -translate-x-1/2 -translate-y-1/2 border rounded-full p-0.5 z-99 bg-white"}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mt-4">
                {group.title}
              </h3>
            )}

            <div className="space-y-2 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted",
                      isActive
                        ? "bg-[#E15D3A] text-primary-foreground shadow-md hover:bg-[#E15D3A]/90"
                        : "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center px-3 py-4"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        "transition-all duration-200",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4",
                        isActive && !isCollapsed && "text-primary-foreground"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
