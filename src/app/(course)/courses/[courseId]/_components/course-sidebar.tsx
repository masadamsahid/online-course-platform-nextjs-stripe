import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/_components/course-progress";

type CourseSidebarProps = {
  course: Prisma.CourseGetPayload<{
    include: {
      chapters: {
        include: { userProgress: true },
      },
    },
  }>;
  progressCount: number;
}

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {

  const { userId } = auth();
  if (!userId) return null;
  
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: { userId, courseId: course.id },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
}