import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/styling/classNames";

/**
 * Button コンポーネント
 *
 * NOTE: このファイルはFigma Code Connectで自動生成される予定です。
 * 現在はプレースホルダー実装です。
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400",
        ghost: "hover:bg-gray-100 focus-visible:ring-gray-400",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
