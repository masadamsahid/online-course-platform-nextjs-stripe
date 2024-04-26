import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    
    const { title } = await req.json();
    if (!title) return new NextResponse("Title is missing", { status: 400 });
    
    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
      select: { id: true, position: true },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        chapters: {
          create: { title, position: newPosition },
        },
      },
    });
    if (!course) return new NextResponse("Failed create chapter", { status: 404 });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_CHAPTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}