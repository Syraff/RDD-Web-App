import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const baseStyles =
      "relative overflow-hidden px-4 py-1 rounded-sm font-normal transition-all duration-300 ease-out group hover:cursor-pointer";

    const variantStyles = {
      default: "border border-primary hover:text-white hover:shadow-lg",
      outline:
        "border-2 border-foreground text-foreground hover:bg-foreground hover:text-background hover:scale-105",
      ghost: "text-foreground hover:bg-muted hover:scale-105",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        <span className="absolute w-0 h-0 rounded-full bg-primary -bottom-full -left-full group-hover:w-[250%] group-hover:h-[250%] transition-all duration-1200 ease-out" />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
