import { CoursesList } from "@/_components/courses-list";
import IconBadge from "@/_components/icon-badge";
import { getDashboardCourses } from "@/actions/get-dashboard";
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { CheckCircle, Clock, LucideIcon } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {}

const page = async (props: Props) => {

  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);


  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}

type InfoCardProps = {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

const InfoCard = ({ icon, label, numberOfItems, variant }: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge
        variant={variant}
        icon={icon}
      />
      <div>
        <p className="font-medium">
          {label}
        </p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  )
};

export default page