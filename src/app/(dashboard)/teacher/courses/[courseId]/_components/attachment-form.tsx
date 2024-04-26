"use client";

import { FileUpload } from "@/_components/file-upload";
import { Button } from "@/_components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Textarea } from "@/_components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type AttachmentFormProps = {
  initialData: Prisma.CourseGetPayload<{
    include: { attachments: true },
  }>;
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId, ...props }: AttachmentFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing(p => !p);

  const onSubmit = async (values: FormSchemaType) => {
    // console.log(values);
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);

      toast.success("Attachment saved");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant='ghost' className="">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length < 1 ? (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments.map((a) => (
                <div key={a.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                  <File className="size-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {a.name}
                  </p>
                  {a.id === deletingId ? (
                    <div>
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  ) : (
                    <button onClick={() => onDelete(a.id)} className="ml-auto hover:opacity-75 hover:text-rose-500 transition">
                      <Trash className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachements"
            onChange={(url) => {
              if (url) onSubmit({ url: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anythin your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentForm;