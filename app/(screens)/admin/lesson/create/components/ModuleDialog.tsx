import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type ModuleValues = {
  moduleName: string;
  moduleDescription: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleValues) => void;
  defaultValues?: ModuleValues;
};

const ModuleDialog = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<ModuleValues>({ defaultValues });
  const isEdit = Boolean(defaultValues);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Module" : "Add Module"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="moduleName"
              render={({ field }) => <Input placeholder="Module Name" {...field} />}
            />
            <FormField
              control={form.control}
              name="moduleDescription"
              render={({ field }) => (
                <Textarea placeholder="Module Description" {...field} />
              )}
            />
            <Button onClick={() => form.handleSubmit(onSubmit)()}>
              {isEdit ? "Update Module" : "Create Module"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
