import { Banner } from "@/_components/banner";
import { getChapter } from "@/actions/get-chapter";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/_components/ui/separator";
import Preview from "@/_components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

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
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={userProgress?.isCompleted}
              />              
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
            {!!attachements.length && (
              <>
                <Separator />
                <div className="p-4">
                  {attachements.map(a => (
                    <a
                      key={a.id} href={a.url} target="_blank"
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File className="size-4" />
                      <p className="line-clamp-1">{a.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;