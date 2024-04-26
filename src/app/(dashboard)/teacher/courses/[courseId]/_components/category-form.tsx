"use client";

import { Button } from "@/_components/ui/button";
import { Combobox } from "@/_components/ui/combobox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Textarea } from "@/_components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Course } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  categoryId: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type CategoryFormProps = {
  initialData: Course;
  courseId: string;
  options: React.ComponentProps<typeof Combobox>['options'];
}

const CategoryForm = ({ initialData, courseId, options, ...props }: CategoryFormProps) => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing(p => !p);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    // console.log(values);
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }
  
  const selectedOption = options.find(option => option.value === initialData.categoryId);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant='ghost' className="">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="size-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      {...field}
                      options={options}
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

export default CategoryForm;