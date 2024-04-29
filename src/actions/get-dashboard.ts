import { db } from "@/lib/db";
import { Prisma } from "@prisma/client"
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Prisma.CourseGetPayload<{
  include: {
    category: true;
    chapters: true;
  }
}> & { progress: number | null };

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[],
  coursesInProgress: CourseWithProgressWithCategory[],
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: { userId },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const courses = await Promise.all(purchasedCourses.map(async ({ course }) => {
      const progress = await getProgress(userId, course.id);
      return { ...course, progress };
    }));
    
    const result = {
      completedCourses: [] as CourseWithProgressWithCategory[],
      coursesInProgress: [] as CourseWithProgressWithCategory[],
    }
    courses.forEach(c => {
      if (c.progress === 100) result.completedCourses.push(c);
      else result.coursesInProgress.push(c);
    });
    
    return result;
  } catch (error) {
    console.log("ACTION_GET_DASHBOARD_COURSES", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}