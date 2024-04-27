import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle } from "lucide-react";



const bannerVariants = cva("border text-center p-4 text-sm flex items-center w-full", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-300 text-primary",
      success: "bg-emerald-700 border-emerald-800 text-secondary",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
}

type BannerProps = VariantProps<typeof bannerVariants> & {
  label: string;
}

export const Banner = ({ label, variant, ...props }: BannerProps) => {

  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))} >
      <Icon className="size-4 mr-2"/>
      {label}
    </div>
  );
}