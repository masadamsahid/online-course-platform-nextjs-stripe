import { db } from "@/lib/db";

type GetChapterArgs = {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({ userId, courseId, chapterId }: GetChapterArgs) => {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
      select: { price: true },
    });
    if(!course) throw new Error("Course not found");
    
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        course: { id: courseId, isPublished: true },
        isPublished: true,
      },
    });
    if(!chapter) throw new Error("Chapter not found");
    
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
    
    const attachements = !purchase ? [] : await db.attachement.findMany({
      where: { courseId },
    });
    
    const isAccesible = (chapter.isFree || !!purchase);
    const muxData = !isAccesible ? null : await db.muxData.findUnique({
      where: { chapterId },
    });
    const nextChapter = !isAccesible ? null : await db.chapter.findFirst({
      where: {
        courseId,
        isPublished: true,
        position: { gt: chapter.position },
      },
      orderBy: { position: "asc" },
    });
    
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: { userId, chapterId },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachements,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[ACTION_GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachements: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
}