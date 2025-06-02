import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import React from "react";

interface InputMobileNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  error?: FieldError;
}

export const InputMobileNumber = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  field,
  error,
}: InputMobileNumberProps<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel className="flex justify-between">
        Mobile Number
        {field.value &&
          field.value.replace(/\D/g, "").length >= 10 &&
          field.value.replace(/\D/g, "").length <= 11 && (
            <div className="text-xs text-grey-300/75 font-normal pointer-events-none">
              Same as: 0{field.value.replace(/^0+/, "")}
            </div>
          )}
      </FormLabel>
      <FormControl>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs">
            <Image
              src="/images/flag-ph.webp"
              alt="Philippine flag"
              width={14}
              height={14}
              className="opacity-75"
            />
            <span className="text-grey-300">+63</span>
          </div>
          <Input
            placeholder="(e.g., 09123456789)"
            type="tel"
            {...field}
            value={field.value.replace(/^\+63/, "")}
            onChange={(e) => {
              // Only allow digits
              const rawValue = e.target.value.replace(/\D/g, "");
              if (rawValue.length === 0) {
                field.onChange("");
                return;
              }
              if (rawValue.length <= 11) {
                // Remove leading 0 for validation
                const valueToCheck = rawValue.startsWith("0")
                  ? rawValue.slice(1)
                  : rawValue;
                // Prevent input if not starting with 9
                if (valueToCheck.length > 0 && valueToCheck[0] !== "9") {
                  field.onChange(rawValue);
                  return;
                }
                field.onChange(rawValue);
              }
            }}
            onBlur={field.onBlur}
            className={`pl-16 pr-4 ${
              error ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
        </div>
      </FormControl>
      <FormMessage className="text-sm text-red-500" />
    </FormItem>
  );
};
