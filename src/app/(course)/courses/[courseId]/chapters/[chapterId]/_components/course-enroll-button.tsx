"use client";

import { Button } from "@/_components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import toast from "react-hot-toast";

type CourseEnrollButtonProps = {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  
  const onClick = async () => {
    try {
      await axios.post(`/api`);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }
  
  return (
    <Button onClick={onClick} size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
}