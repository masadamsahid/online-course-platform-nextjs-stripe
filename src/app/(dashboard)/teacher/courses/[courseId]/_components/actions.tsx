"use client";

import ConfirmModal from "@/_components/modals/confirm-modal";
import { Button } from "@/_components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type ActionsProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const Actions = ({ courseId, isPublished, disabled, ...props }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const onDelete = async () => {
    try {
      setIsLoading(true);
      
      await axios.delete(`/api/courses/${courseId}`);
      
      toast.success("Deleting course success");
      router.push(`/teacher/courses/`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const onClick = async () => {
    try {
      setIsLoading(true);
      
      if(isPublished)await axios.patch(`/api/courses/${courseId}/unpublish`);
      else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        confetti.onOpen();
      }
      
      toast.success(isPublished ? "Success unpublish course" : "Success publish course");
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
        onClick={onClick}
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

export default Actions;