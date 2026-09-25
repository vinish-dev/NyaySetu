import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200",
        destructive:
          "bg-red-50 text-red-700 border border-red-200",
        warning:
          "bg-amber-50 text-amber-800 border border-amber-200",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        purple:
          "bg-indigo-50 text-indigo-700 border border-indigo-200",
        outline:
          "border border-slate-200 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
