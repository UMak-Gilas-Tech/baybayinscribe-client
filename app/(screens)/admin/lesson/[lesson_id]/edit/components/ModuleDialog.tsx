import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type ModuleValues = {
  moduleName: string;
  moduleDescription: string;
};

const moduleSchema = z.object({
  moduleName: z.string().min(1, "Module name is required"),
  moduleDescription: z.string().min(1, "Module description is required"),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleValues) => void;
  defaultValues?: ModuleValues;
};

const ModuleDialog = ({ isOpen, onClose, onSubmit, defaultValues }: Props) => {
  const form = useForm<ModuleValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues,
  });
  const isEdit = Boolean(defaultValues);

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Module" : "Add Module"}</DialogTitle>
        </DialogHeader>
        <ShadcnForm {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="moduleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Module Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moduleDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Module Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isEdit ? "Update Module" : "Create Module"}
            </Button>
          </form>
        </ShadcnForm>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
