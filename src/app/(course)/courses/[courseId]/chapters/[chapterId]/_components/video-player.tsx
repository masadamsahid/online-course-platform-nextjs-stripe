"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";

type VideoPlayer = {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId?: string;
  isLocked: boolean;
  completOnEnd: boolean;
}

export const VideoPlayer = ({ chapterId, title, courseId, nextChapterId, playbackId, isLocked, completOnEnd }: VideoPlayer) => {
  
  const [isReady, setIsReady] = useState(false);
  
  const router = useRouter();
  const confetti = useConfettiStore();
  
  const onEnded = async () => {
    try {
      if (completOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
        
        if (!nextChapterId) confetti.onOpen();
        
        toast.success("Progress Updated");
        router.refresh();
        
        if (nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      
    }
  }
  
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gay2 text-secondary">
          <Lock className="size-8" />
          <p className="text-sm">This chapter is lockerd</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnded}
          autoPlay
        />
      )}
    </div>
  );
}

