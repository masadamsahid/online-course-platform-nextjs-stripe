import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string }; }) {
  try {
    const { userId } = auth();
    if(!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const { courseId } = params;
    if(!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    
    const { userId:_, courseId:__, createdAt, updatedAt, ...values } = await req.json();
    
    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });
    if(!course) return new NextResponse("Course not found", { status: 404 });
    
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}