"use client";

import ConfirmModal from "@/_components/modals/confirm-modal";
import { Button } from "@/_components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type ChapterActionsProps = {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({ chapterId, courseId, isPublished, disabled, ...props }: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const onDelete = async () => {
    try {
      setIsLoading(true);
      
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      
      toast.success("Deleting success");
      router.push(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        onClick={() => { }}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size="sm" variant="destructive">
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default ChapterActions;