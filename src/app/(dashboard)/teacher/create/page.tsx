"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/_components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/_components/ui/form";
import { Button } from "@/_components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

type Props = {}

const CreatePage = (props: Props) => {
  const router = useRouter();
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const res = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${res.data.id}`);
      toast.success("Course created");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Something went wrong");
      console.log(error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} placeholder="e.g. 'Advanced web devlopmnt'" />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button asChild variant="ghost">
                <Link href="/">
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreatePage;