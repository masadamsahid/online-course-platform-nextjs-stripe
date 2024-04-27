import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string; }; }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });

    const course = await db.course.findUnique({
      where: {
        userId,
        id: courseId,
      },
      include: {
        chapters: {
          include: { muxData: true },
        },
      },
    });
    if (!course) return new NextResponse("Not Found", { status: 404 });
    
    const hasPublishedChapter = course.chapters.some(c => c.isPublished);
    
    if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
      return new NextResponse("Not Found", { status: 404 })
    };

    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}