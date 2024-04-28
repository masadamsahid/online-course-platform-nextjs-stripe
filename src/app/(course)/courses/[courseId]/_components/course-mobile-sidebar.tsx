import { Prisma } from "@prisma/client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/_components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";


type CourseMobileSidebarProps = {
  course: Prisma.CourseGetPayload<{
    include: {
      chapters: {
        include: { userProgress: true },
      },
    },
  }>;
  progressCount: number;
}

export const CourseMobileSidebar = ({ course, progressCount }: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu/>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  );
}