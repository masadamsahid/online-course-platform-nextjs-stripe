"use client";

import Editor from "@/_components/editor";
import Preview from "@/_components/preview";
import { Button } from "@/_components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ChapterDescFormProps = {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterDescForm = ({ initialData, courseId, chapterId, ...props }: ChapterDescFormProps) => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing(p => !p);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    // console.log(values);
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter description
        <Button onClick={toggleEdit} variant='ghost' className="">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="size-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
          {!initialData.description ? "No description" : (
            <Preview
              value={initialData.description}
            />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ChapterDescForm;