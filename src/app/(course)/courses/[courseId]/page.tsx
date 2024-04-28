import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: { courseId: string }
}

const CourseIdPage = async ({ params: { courseId } }: Props) => {
  
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });
  
  if(!course || course.chapters.length < 1) return redirect("/search");
  
  console.log("ssss",{course});
  
  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

export default CourseIdPage;