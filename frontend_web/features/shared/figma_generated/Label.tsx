import { cn } from "@/features/shared/lib/classNames";

/**
 * Label コンポーネント
 *
 * NOTE: このファイルはFigma Code Connectで自動生成される予定です。
 * 現在はプレースホルダー実装です。
 */

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
	return (
		<label
			className={cn(
				"text-sm font-medium leading-none text-sds_light-Text-Default-Primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
				className,
			)}
			{...props}
		/>
	);
}
