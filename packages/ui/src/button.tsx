import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  tone?: "brand" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
};

function variantClasses(
  variant: NonNullable<ButtonProps["variant"]>,
  tone: NonNullable<ButtonProps["tone"]>,
): string {
  if (variant === "primary") {
    return tone === "danger"
      ? "bg-danger text-on-primary hover:bg-danger-hover"
      : "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active";
  }
  if (variant === "secondary") {
    return "border border-border-card bg-surface text-fg hover:bg-surface-hover";
  }
  return tone === "danger" ? "text-danger hover:bg-surface-hover" : "text-primary hover:bg-surface-hover";
}

export function Button({
  variant = "primary",
  tone = "brand",
  size = "sm",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, SIZES[size], variantClasses(variant, tone), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
