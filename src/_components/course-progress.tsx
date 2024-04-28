import { Progress } from "@/_components/ui/progress";
import { cn } from "@/lib/utils";

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
}

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
}

type CourseProgress = {
  value: number;
  variant: "default" | "success";
  size?: "default" | "sm";
}

export const CourseProgress = ({ value, variant, size }: CourseProgress) => {

  return (
    <div>
      <Progress
        value={value}
        variant={variant}
        className="h-2"
      />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"],
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
}