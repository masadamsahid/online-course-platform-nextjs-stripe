import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";

const backgoundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-sky-100",
        success: "bg-emerald-100"
      },
      size: {
        default: "p-2",
        sm: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const iconVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-sky-700",
        success: "text-emerald-700",
      },
      size: {
        default: "size-8",
        sm: "size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type BackgoundVariantsProps = VariantProps<typeof backgoundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

type IconBadgeProps = BackgoundVariantsProps & IconVariantsProps & {
  icon: LucideIcon;
};

const IconBadge = ({ icon: Icon, size, variant, ...props }: IconBadgeProps) => {
  return (
    <div
      className={cn(backgoundVariants({ variant, size }))}
    >
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
}

export default IconBadge;