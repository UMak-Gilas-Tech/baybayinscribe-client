import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export type LessonInfoValues = {
  lessonName: string;
  lessonDescription: string;
  isLessonVisible: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonInfoValues) => void;
  defaultValues?: LessonInfoValues;
};

const LessonInfoDialog = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<LessonInfoValues>({ defaultValues });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Resource Details</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add or edit the lesson’s title, description, and visibility.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="lessonName"
              render={({ field }) => (
                <Input placeholder="Lesson Name" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="lessonDescription"
              render={({ field }) => (
                <Textarea placeholder="Lesson Description" {...field} />
              )}
            />
            <FormField
              control={form.control}
              name="isLessonVisible"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span>Is lesson visible?</span>
                </div>
              )}
            />
            <Button onClick={() => form.handleSubmit(onSubmit)()}>
              Save
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonInfoDialog;
