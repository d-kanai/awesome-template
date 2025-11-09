/**
 * Figma生成コンポーネントをプロジェクトのTailwindクラスに変換するスクリプト
 */

// Figma Variables → Tailwind Class のマッピング
const variableToClassMap: Record<string, string> = {
	// Colors - Background
	"var(--sds-color-background-default-default,#ffffff)": "bg-sds_light-Background-Default-Default",
	"var(--sds-color-background-brand-tertiary,#f5f5f5)": "bg-sds_light-Background-Brand-Tertiary",
	"var(--sds-color-background-neutral-tertiary,#e3e3e3)": "bg-sds_light-Background-Neutral-Tertiary",
	"var(--sds-color-background-brand-default,#2c2c2c)": "bg-sds_light-Background-Brand-Default",

	// Colors - Text
	"text-[color:var(--sds-color-text-default-default,#1e1e1e)]": "text-sds_light-Text-Default-Default",
	"text-[color:var(--sds-color-text-brand-on-brand-secondary,#1e1e1e)]": "text-sds_light-Text-Brand-On-Brand-Secondary",
	"text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)]": "text-sds_light-Text-Brand-On-Brand",

	// Colors - Border
	"border-[var(--sds-color-border-default-default,#d9d9d9)]": "border-sds_light-Border-Default-Default",
	"border-[var(--sds-color-border-neutral-secondary,#767676)]": "border-sds_light-Border-Neutral-Secondary",
	"border-[var(--sds-color-border-brand-default,#2c2c2c)]": "border-sds_light-Border-Brand-Default",

	// Spacing
	"gap-[var(--sds-size-space-200,8px)]": "gap-Space-200",
	"gap-[var(--sds-size-space-300,12px)]": "gap-Space-300",
	"gap-[var(--sds-size-space-600,0px24px)]": "gap-Space-600", // Note: 元の値が0px24pxなので24pxとして扱う
	"p-[var(--sds-size-space-200,8px)]": "p-Space-200",
	"p-[var(--sds-size-space-800,32px)]": "p-Space-800",

	// Border radius
	"rounded-[var(--sds-size-radius-200,8px)]": "rounded-lg", // 8px = Tailwindのlg

	// Border width
	"border-[var(--sds-size-stroke-border,1px)]": "border",

	// Typography
	"font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]":
		"font-sans",
	"font-[var(--sds-typography-body-font-weight-regular,400)]": "font-normal",
	"text-[length:var(--sds-typography-body-size-medium,16px)]": "text-base",
};

/**
 * Figma生成のclassNameを変換
 */
export function convertClassName(className: string): string {
	let converted = className;

	// マッピングに基づいて置換
	for (const [figmaClass, tailwindClass] of Object.entries(
		variableToClassMap,
	)) {
		converted = converted.replace(new RegExp(escapeRegex(figmaClass), "g"), tailwindClass);
	}

	// 残ったvar()を削除（未マッピングの変数）
	// bg-[var(--xxx,#fff)] → bg-[#fff] の形に変換
	converted = converted.replace(
		/bg-\[var\(--[\w-]+,(#[a-f0-9]+)\)\]/gi,
		"bg-[$1]",
	);
	converted = converted.replace(
		/text-\[color:var\(--[\w-]+,(#[a-f0-9]+)\)\]/gi,
		"text-[$1]",
	);
	converted = converted.replace(
		/border-\[var\(--[\w-]+,(#[a-f0-9]+)\)\]/gi,
		"border-[$1]",
	);

	return converted;
}

/**
 * 正規表現用にエスケープ
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * TSXコード全体を変換
 */
export function convertFigmaComponent(code: string): string {
	// className="..." の部分を抽出して変換
	return code.replace(/className="([^"]*)"/g, (_match, className) => {
		const converted = convertClassName(className);
		return `className="${converted}"`;
	});
}

// CLIとして実行された場合
if (require.main === module) {
	const fs = require("fs");
	const path = require("path");

	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error("Usage: tsx convert-figma-component.ts <input-file> [output-file]");
		process.exit(1);
	}

	const inputFile = args[0];
	const outputFile = args[1] || inputFile.replace(".tsx", ".converted.tsx");

	const code = fs.readFileSync(inputFile, "utf-8");
	const converted = convertFigmaComponent(code);

	fs.writeFileSync(outputFile, converted, "utf-8");
	console.log(`✅ Converted: ${inputFile} → ${outputFile}`);
}
