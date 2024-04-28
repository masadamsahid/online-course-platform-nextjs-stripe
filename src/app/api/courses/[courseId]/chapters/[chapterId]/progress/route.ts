import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
  try {
    const { userId } = auth();
    if(!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const { isCompleted } = await req.json();
    if(isCompleted === undefined) return new NextResponse("Complete status is missing", { status: 400 });
    
    const { courseId, chapterId } = params;
    
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId },
      },
      update: { isCompleted },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });
    
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}