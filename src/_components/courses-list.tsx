import { Prisma } from "@prisma/client";
import { CourseCard } from "@/_components/course-card";

type CourseWithProgressWithCategory = Prisma.CourseGetPayload<{
  include: {
    category: true,
    chapters: { select: { id: true } },
  }
}> & { progress: number | null };

type CoursesList = {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesList) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length < 1 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
}