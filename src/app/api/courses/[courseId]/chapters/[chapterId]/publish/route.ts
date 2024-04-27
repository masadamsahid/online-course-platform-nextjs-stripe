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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        course: { id: courseId, userId },
      },
      include: { muxData: true },
    });
    if (!chapter) return new NextResponse("Not Found", { status: 404 });

    const { muxData, title, description, videoUrl } = chapter;
    if (!muxData || !title || !description || !videoUrl) return new NextResponse("Missing required fields", { status: 400 });

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        course: { id: courseId, userId },
      },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}