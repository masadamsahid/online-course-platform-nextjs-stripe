import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });

    const { url } = await req.json();

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        attachments: {
          create: {
            url,
            name: url.split("/").pop(),
          }
        },
      },
    });
    if (!course) return new NextResponse("Course not found", { status: 404 });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ATTACHMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}