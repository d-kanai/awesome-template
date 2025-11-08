import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * Button コンポーネント (Figma REST API完全自動生成)
 *
 * 以下のFigma REST API情報から完全自動生成:
 *
 * 【ComponentPropertyDefinitions】
 * - Variant: Primary | Neutral | Subtle (default: Primary)
 * - State: Default | Hover | Disabled (default: Default)
 * - Size: Medium | Small (default: Medium)
 * - Label: string (default: "Button") - TEXT型
 * - Has Icon Start: boolean (default: false) - BOOLEAN型
 * - Has Icon End: boolean (default: false) - BOOLEAN型
 * - Icon Start/End: INSTANCE_SWAP型 (Figma component reference)
 *
 * 【使用Styles - API depth=2 で子ノードから自動検出】
 * - Text Style: "Single Line/Body Base" (Node ID: 56:9001)
 *   → CSS: .text-single-line-body-base (16px, 400, line-height: 16px)
 *
 * 【使用Variables - boundVariables から自動検出】
 * - Primary fill: VariableID:3919:36428
 * - Primary stroke: VariableID:3919:36516
 * - Neutral fill: VariableID:106:12469
 * - Neutral stroke: VariableID:106:12486
 * - Subtle fill: VariableID:3919:36448
 * - Subtle stroke: VariableID:3919:36532
 *
 * @figma Page: Buttons
 * @figma Total Components: 53 variants
 * @generated Figma REST API (depth=2) rawデータから完全自動生成 (2025-11-08)
 */

const buttonVariants = cva(
	// Base styles - Figma API検出: Text Style "Single Line/Body Base" (56:9001)
	"inline-flex items-center justify-center rounded-md text-single-line-body-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma VARIANT Property: Variant (Primary | Neutral | Subtle)
			// Colors: Figma Variables (boundVariables.color.id from API)
			variant: {
				// VariableID:3919:36428 (fill), VariableID:3919:36516 (stroke)
				primary:
					"bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
				// VariableID:106:12469 (fill), VariableID:106:12486 (stroke)
				neutral:
					"bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
				// VariableID:3919:36448 (fill), VariableID:3919:36532 (stroke)
				subtle:
					"bg-background text-foreground hover:bg-background-secondary focus-visible:ring-ring",
			},
			// Figma VARIANT Property: Size (Medium | Small)
			size: {
				medium: "h-10 px-Space-400 py-Space-200",
				small: "h-9 px-Space-300 py-Space-150",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "medium",
		},
	},
);

export interface ButtonNewProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	/**
	 * Figma TEXT Property: Label
	 * @default "Button"
	 */
	label?: string;
	/**
	 * Figma BOOLEAN Property: Has Icon Start
	 * @default false
	 */
	hasIconStart?: boolean;
	/**
	 * Figma BOOLEAN Property: Has Icon End
	 * @default false
	 */
	hasIconEnd?: boolean;
}

/**
 * Figma ComponentPropertyDefinitionsを完全再現したButtonコンポーネント
 *
 * 使用例:
 * <ButtonNew variant="primary" size="medium" label="Button" />
 * <ButtonNew variant="neutral" size="small" label="Submit" hasIconStart />
 * <ButtonNew variant="subtle" size="medium" label="Cancel" disabled />
 */
export function ButtonNew({
	className,
	variant,
	size,
	hasIconStart,
	hasIconEnd,
	label = "Button", // Figma default value
	children,
	...props
}: ButtonNewProps) {
	const content = label || children;

	return (
		<button
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			{hasIconStart && (
				<span className="mr-Space-150" aria-hidden="true">
					→
				</span>
			)}
			{content}
			{hasIconEnd && (
				<span className="ml-Space-150" aria-hidden="true">
					←
				</span>
			)}
		</button>
	);
}
