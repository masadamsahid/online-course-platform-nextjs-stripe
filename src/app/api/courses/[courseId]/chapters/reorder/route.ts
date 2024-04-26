import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    
    const { list }: { list: { id: string; position: number; }[] } = await req.json();
    if (list.length < 1) return new NextResponse("Reordered list is missing", { status: 400 });
    
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        chapters: {
          updateMany: list.map(c => ({
            where: { id: c.id, courseId },
            data: { position: c.position },
          })),
        },
      },
    });
    if (!course) return new NextResponse("Failed reordering", { status: 404 });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_CHAPTER_REORDER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}