import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string; }; }) {
  try {
    const { userId } = auth();
    if(!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const { courseId, chapterId } = params;
    if(!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    if(!chapterId) return new NextResponse("Chapter ID is missing", { status: 400 });
    
    const { userId:_, courseId:__, createdAt, updatedAt, isPublished, ...values } = await req.json();
    
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        chapters: {
          update: {
            where: { id: chapterId },
            data: { ...values },
          },
        },
      },
    });
    if(!course) return new NextResponse("Failed updating chapter", { status: 404 });
    
    // TODO: Handle video upload
    
    return NextResponse.json(course);
  } catch (error) {
    console.log("[CHAPTER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}