import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * Button コンポーネント
 *
 * NOTE: このファイルはFigma Code Connectで自動生成される予定です。
 * 現在はプレースホルダー実装です。
 */

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-body-small-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
				outline:
					"border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
				ghost:
					"text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive-hover focus-visible:ring-ring",
			},
			size: {
				sm: "h-9 px-Space-300",
				md: "h-10 px-Space-400 py-Space-200",
				lg: "h-11 px-Space-800",
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
