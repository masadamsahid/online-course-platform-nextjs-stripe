"use client";

import { Button } from "@/_components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Textarea } from "@/_components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ChaptersList from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ChaptersFormProps = {
  initialData: Prisma.CourseGetPayload<{
    include: { chapters: true },
  }>;
  courseId: string;
}

const ChaptersForm = ({ initialData, courseId, ...props }: ChaptersFormProps) => {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const toggleCreating = () => setIsCreating(p => !p);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    // console.log(values);
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);

      toast.success("Chapter created");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }
  
  const onEdit =  (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  const onReorder = async (updatedData: { id: string; position: number; }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData,
      });

      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute size-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin size-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant='ghost' className="">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. 'Into to the course...'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "No Chapters"}
          {/* TODO: Add list of chapters  */}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drap and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}

export default ChaptersForm;