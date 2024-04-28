import { db } from "@/lib/db";
import { Prisma } from "@prisma/client"
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Prisma.CourseGetPayload<{
  include: {
    category: true,
    chapters: { select: { id: true } },
  }
}> & { progress: number | null };

type GetCoursesOptions = {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({ userId, categoryId, title }: GetCoursesOptions): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        title: { contains: title },
      },
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if(course.purchases.length === 0)  return { ...course, progress: null };
                
        const progressPercentage = await getProgress(userId, course.id);
        return { ...course, progress: progressPercentage };
      })
    );
    
    return coursesWithProgress;
  } catch (error) {
    console.log("[ACTION_GET_COURSES]", error);
    return [];
  }
}