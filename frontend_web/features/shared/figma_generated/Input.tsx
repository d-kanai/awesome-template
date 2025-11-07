import { cn } from "@/features/shared/lib/classNames";
import { forwardRef } from "react";

/**
 * Input コンポーネント
 *
 * NOTE: このファイルはFigma Code Connectで自動生成される予定です。
 * 現在はプレースホルダー実装です。
 */

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-sds_light-Border-Default bg-sds_light-Background-Default px-Space-300 py-Space-200 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sds_light-Text-Default-Tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sds_light-Border-Brand-Default focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";
