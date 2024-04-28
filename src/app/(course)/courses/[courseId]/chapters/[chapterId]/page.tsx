import { Banner } from "@/_components/banner";
import { getChapter } from "@/actions/get-chapter";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";

type Props = {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIdPage = async ({ params: { chapterId, courseId } }: Props) => {

  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachements,
    nextChapter,
    userProgress,
    purchase
  } = await getChapter({ userId, chapterId, courseId });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner variant="warning" label="You need to purchase this course to watch this chapter." />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completOnEnd={completOnEnd}
          />
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;