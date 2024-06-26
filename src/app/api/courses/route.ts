import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const { userId } = auth();
    if(!userId) return new NextResponse("Unauthorized", { status: 401 });
    
    const { title } = await req.json();
    if(!title) return new NextResponse("Title is missing", { status: 404 });
    
    const course = await db.course.create({
      data: { userId, title },
    });
    if(!course) return new NextResponse("Course not found", { status: 404 });
    
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}