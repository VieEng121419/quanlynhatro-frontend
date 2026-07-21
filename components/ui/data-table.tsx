// components/ui/data-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  search?: string;
  textNotFound: string;
  onSearchChange?: (value: string) => void;
  onPageChange?: (page: number) => void;
  filterOptions?: Array<{ label: string; value: string }>;
  onFilterChange?: (value: string) => void;
}

export function DataTable<T>({
  data,
  columns,
  meta,
  isLoading = false,
  search = "",
  onSearchChange,
  onPageChange,
  filterOptions = [],
  onFilterChange,
  textNotFound = 'Không tìm thấy phòng nào',
}: DataTableProps<T>) {
  return (
    <div className="space-y-4 bg-background p-4 rounded-xl border-1 border-[#D9D9D9]">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder="Tìm theo số phòng..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="max-w-sm"
        />

        {filterOptions.length > 0 && (
          <select
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="border border-input bg-[#EAEAEA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tất cả trạng thái</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={`${String(col.key)}-${index}`}
                  className={cn(
                    col.key === "id" ? "text-right pr-7" : "",
                    "font-medium"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
              {/* <TableHead className="text-right">Thao tác</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  {textNotFound}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col, idx) => (
                    <TableCell key={`${String(col.key)}-${idx}`}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {/* <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="m-0! p-2!">
                      <Bolt />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && onPageChange && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Hiển thị {data.length} trong tổng {meta.totalItems} phòng
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="px-3 py-1 border rounded-md">
              {meta.currentPage} / {meta.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
