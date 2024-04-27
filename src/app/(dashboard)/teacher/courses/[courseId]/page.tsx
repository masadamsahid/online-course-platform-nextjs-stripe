import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import IconBadge from "@/_components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import TitleForm from "./_components/title-form";
import DescForm from "./_components/desc-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";
import { Banner } from "@/_components/banner";
import Actions from "./_components/actions";

type Props = {
  params: { courseId: string };
}

const CourseIdPage = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      chapters: {
        orderBy: { position: "asc" },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!course) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });
  // console.log(categories);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(c => c.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublish. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {/* TODO: Add action */}
          <Actions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map(({ id, name }) => ({ label: name, value: id }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <div>
                <ChaptersForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <div>
                <PriceForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <div>
                <AttachmentForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;