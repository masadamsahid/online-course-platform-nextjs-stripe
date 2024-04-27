import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string; }; }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, chapterId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    if (!chapterId) return new NextResponse("Chapter ID is missing", { status: 400 });

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        course: { id: courseId, userId },
      },
      data: { isPublished: false },
    });
    if (!unpublishedChapter) return new NextResponse("Not Found", { status: 404 });
        
    const otherPublishedChapter = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
    });
    if(otherPublishedChapter.length < 1) await db.course.update({
      where: { id: courseId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_UNPUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}