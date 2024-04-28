import { getCourses } from "@/actions/get-courses";
import Categories from "./_components/categories";
import SearchInput from "@/_components/search-input";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/_components/courses-list";

type Props = {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: Props) => {

  const { userId } = auth();
  if (!userId) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const { title, categoryId } = searchParams;

  const courses = await getCourses({
    title,
    categoryId,
    userId,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories
          items={categories}
        />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

export default SearchPage;