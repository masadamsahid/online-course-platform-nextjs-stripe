import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string; }; }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });

    const unpublishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: false },
    });
    if (!unpublishedCourse) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}