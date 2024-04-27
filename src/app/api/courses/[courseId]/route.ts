import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string }; }) {
  try {
    const { userId } = auth();
    if(!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const { courseId } = params;
    if(!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: { muxData: true },
        },
      },
    });
    if(!course) return new NextResponse("Course not found", { status: 404 });
    
    await Promise.all(course.chapters.map( async c => {
      if(c.muxData) await video.assets.delete(c.muxData.assetId);
      return;
    }));
    
    const deletedCourse = await db.course.delete({
      where: { id: courseId, userId },
    });
    
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

