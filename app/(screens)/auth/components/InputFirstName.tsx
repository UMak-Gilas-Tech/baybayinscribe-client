import React from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

interface InputFirstNameProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  error?: FieldError;
}

export const InputFirstName = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  field,
  error,
}: InputFirstNameProps<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel>First Name</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter your given name"
          type="text"
          {...field}
          className={error ? "border-red-500 focus:ring-red-500" : ""}
        />
      </FormControl>
      <FormMessage className="text-sm text-red-500" />
    </FormItem>
  );
};
