"use client";

import { FileUpload } from "@/_components/file-upload";
import { Button } from "@/_components/ui/button";
import type { Prisma } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import MuxPlayer  from "@mux/mux-player-react";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ChapterVideoFormProps = {
  initialData: Prisma.ChapterGetPayload<{ include: { muxData: true }}>;
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ initialData, courseId, chapterId, ...props }: ChapterVideoFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing(p => !p);

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
        Chapter video
        <Button onClick={toggleEdit} variant='ghost' className="">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="size-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="size-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center gap-2 h-60 bg-slate-200 rounded-md">
            <Video className="size-10 text-slate-500" />
            <p className="italic text-muted-foreground">No video yet</p>
          </div>
        ) : (
          <div className="relative aspect-video m-2">
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter's video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few mnutes to process. Refresh the page if video doesn't appear.
        </div>
      )}
    </div>
  );
}

export default ChapterVideoForm;