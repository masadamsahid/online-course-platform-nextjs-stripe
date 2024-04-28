"use client";

import { Button } from "@/_components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type CourseProgressButtonProps = {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

export const CourseProgressButton = ({ chapterId, courseId, nextChapterId, isCompleted }: CourseProgressButtonProps) => {
  
  const router = useRouter();
  const confetti = useConfettiStore();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const Icon = isCompleted ? XCircle : CheckCircle;
  
  const onClick = async () => {
    try {
      setIsLoading(true);
      
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted,
      });
      
      if (!isCompleted && !nextChapterId) confetti.onOpen();
      if (!isCompleted && nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      
      toast.success("Progress Updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Button onClick={onClick} type="button" variant={isCompleted ? "outline" : "success"} className="w-full md:w-auto">
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="size-4 ml-2"/>
    </Button>
  );
}