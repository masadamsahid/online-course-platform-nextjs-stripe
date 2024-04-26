import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { courseId, attachmentId } = params;
    if (!courseId) return new NextResponse("Course ID is missing", { status: 400 });
    if (!attachmentId) return new NextResponse("Attachment ID is missing", { status: 400 });

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: {
        attachments: {
          delete: {
            courseId,
            id: attachmentId,
          },
        },
      },
    });
    if (!course) return new NextResponse("Course not found", { status: 404 });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ATTACHMENT_ID_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}