import { cn } from "@/features/shared/lib/classNames";

/**
 * Card コンポーネント
 *
 * NOTE: このファイルはFigma Code Connectで自動生成される予定です。
 * 現在はプレースホルダー実装です。
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-background text-foreground shadow-md",
				className,
			)}
			{...props}
		/>
	);
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
	return (
		<div
			className={cn("flex flex-col space-y-Space-150 p-Space-600", className)}
			{...props}
		/>
	);
}

export interface CardTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
	return (
		<h3
			className={cn(
				"text-2xl font-semibold leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

export interface CardContentProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
	return <div className={cn("p-Space-600 pt-0", className)} {...props} />;
}
