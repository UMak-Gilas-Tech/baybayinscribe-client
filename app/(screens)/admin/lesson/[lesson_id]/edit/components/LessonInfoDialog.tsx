import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form as ShadcnForm, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export type LessonInfoValues = {
  lessonName: string;
  lessonDescription: string;
  isLessonVisible: boolean;
};

const lessonInfoSchema = z.object({
  lessonName: z.string().min(1, "Lesson name is required"),
  lessonDescription: z.string().min(1, "Lesson description is required"),
  isLessonVisible: z.boolean(),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonInfoValues) => void;
  defaultValues?: LessonInfoValues;
  loading?: boolean;
};

const LessonInfoDialog = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  loading = false,
}: Props) => {
  const form = useForm<LessonInfoValues>({
    resolver: zodResolver(lessonInfoSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Resource Details</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add or edit the lesson’s title, description, and visibility.
          </DialogDescription>
        </DialogHeader>
        <ShadcnForm {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="lessonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lessonDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lesson Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isLessonVisible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is lesson visible?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Saving...</span>
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </ShadcnForm>
      </DialogContent>
    </Dialog>
  );
};

export default LessonInfoDialog;
