"use client";

import { forwardRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number | string;
  onValueChange?: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = "", onValueChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
      if (value !== undefined) {
        const num = typeof value === "number" ? value : Number(value);
        setDisplayValue(num.toLocaleString("vi-VN"));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/[^0-9]/g, ""); // Chỉ giữ số
      console.log("🚀 ~ handleChange ~ input:", input)
      const numericValue = Number(input);

      setDisplayValue(input ? numericValue.toLocaleString("vi-VN") : "");

      if (onValueChange) {
        onValueChange(numericValue);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder="0"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
