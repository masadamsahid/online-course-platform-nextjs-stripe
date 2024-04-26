"use client";

import { FileUpload } from "@/_components/file-upload";
import { Button } from "@/_components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Textarea } from "@/_components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ImageFormProps = {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId, ...props }: ImageFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing(p => !p);

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

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant='ghost' className="">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="size-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="size-10 text-slate-500" />
            <p className="italic text-muted-foreground">No image yet</p>
          </div>
        ) : (
          <div className="relative aspect-video m-2">
            <Image
              fill
              alt="upload"
              className="object-contain rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageForm;