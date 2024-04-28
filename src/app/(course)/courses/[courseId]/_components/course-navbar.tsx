import NavbarRoutes from "@/_components/navbar-routes";
import { Prisma } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

type CourseNavbarProps = {
  course: Prisma.CourseGetPayload<{
    include: {
      chapters: {
        include: { userProgress: true },
      },
    },
  }>;
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes/>
    </div>
  )
}