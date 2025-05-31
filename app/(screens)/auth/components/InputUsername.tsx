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

interface InputUsernameProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  error?: FieldError;
}

export const InputUsername = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  field,
  error,
}: InputUsernameProps<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input
          placeholder="Create a unique username (3-16 characters)"
          type="text"
          maxLength={16}
          {...field}
          className={error ? "border-red-500 focus:ring-red-500" : ""}
        />
      </FormControl>
      <FormMessage className="text-sm text-red-500" />
    </FormItem>
  );
};
