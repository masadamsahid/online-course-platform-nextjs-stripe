"use client";

import { Button } from "@/_components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type CourseEnrollButtonProps = {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const onClick = async () => {
    try {
      setIsLoading(true)
      
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      
      toast.success("Success checkout");
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Button onClick={onClick} size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
}