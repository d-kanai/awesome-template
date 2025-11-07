import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

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
				primary:
					"bg-sds_light-Background-Brand-Default text-sds_light-Text-Brand-On-Brand hover:bg-sds_light-Background-Brand-Hover focus-visible:ring-sds_light-Border-Brand-Default",
				secondary:
					"bg-sds_light-Background-Brand-Secondary text-sds_light-Text-Brand-Default hover:bg-sds_light-Background-Brand-Secondary-Hover focus-visible:ring-sds_light-Border-Brand-Secondary",
				outline:
					"border border-sds_light-Border-Default-Default bg-transparent text-sds_light-Text-Default-Default hover:bg-sds_light-Background-Default-Default-Hover focus-visible:ring-sds_light-Border-Default-Default",
				ghost:
					"text-sds_light-Text-Default-Default hover:bg-sds_light-Background-Default-Default-Hover focus-visible:ring-sds_light-Border-Default-Default",
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
