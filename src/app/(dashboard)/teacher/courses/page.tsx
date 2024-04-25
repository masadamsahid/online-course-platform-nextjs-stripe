import { Button } from "@/_components/ui/button";
import Link from "next/link";

type Props = {}

const CoursesPage = (props: Props) => {
  return (
    <div className="p-6">
      <Button asChild>
        <Link href="/teacher/create">
          New Course
        </Link>
      </Button>
    </div>
  );
}

export default CoursesPage;