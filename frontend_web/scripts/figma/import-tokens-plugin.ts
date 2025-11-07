import * as fs from "node:fs";
import * as path from "node:path";
import type { DesignTokens } from "./types";

/**
 * Design Tokensの形式
 * W3C形式（$プレフィックス）と一般的な形式（プレフィックスなし）の両方に対応
 */
interface Token {
	value?: string | number;
	$value?: string | number;
	type?: string;
	$type?: string;
	description?: string;
	$description?: string;
	prefix?: string;
}

interface TokenGroup {
	[key: string]: Token | TokenGroup;
}

/**
 * プリミティブトークンの辞書を構築
 * 例: "Brand-800" -> "#2c2c2c"
 */
function buildPrimitiveLookup(
	tokenData: TokenGroup,
	prefix = "",
): Record<string, string> {
	const lookup: Record<string, string> = {};

	for (const [key, value] of Object.entries(tokenData)) {
		if (typeof value !== "object") continue;

		const token = value as Token;
		const tokenValue = token.$value ?? token.value;

		if (tokenValue !== undefined) {
			// プリミティブトークンの名前を構築（例: "Brand-800"）
			const tokenName = prefix ? `${prefix}-${key}` : key;
			lookup[tokenName] = String(tokenValue);
		} else {
			// グループなので再帰
			const tokenName = prefix ? `${prefix}-${key}` : key;
			Object.assign(
				lookup,
				buildPrimitiveLookup(value as TokenGroup, tokenName),
			);
		}
	}

	return lookup;
}

/**
 * Design Tokens形式のJSONを読み込んで、内部形式に変換
 * W3C形式（$プレフィックス）と一般形式（プレフィックスなし）の両方に対応
 */
function convertTokens(
	tokenData: TokenGroup,
	primitiveLookup: Record<string, string> = {},
): Partial<DesignTokens> {
	const tokens: Partial<DesignTokens> = {
		colors: {},
		spacing: {},
		fontSize: {},
		fontWeight: {},
		lineHeight: {},
	};

	function traverse(obj: TokenGroup, prefix = "") {
		for (const [key, value] of Object.entries(obj)) {
			const tokenName = prefix ? `${prefix}-${key}` : key;

			if (typeof value !== "object") continue;

			const token = value as Token;
			// $value または value があればトークン、なければグループ
			const tokenValue = token.$value ?? token.value;

			if (tokenValue !== undefined) {
				const type = (token.$type ?? token.type)?.toLowerCase();

				// 参照を解決
				let finalValue = String(tokenValue);

				// W3C形式の参照: {color.primary} -> color-primary
				if (finalValue.startsWith("{") && finalValue.endsWith("}")) {
					finalValue = finalValue.slice(1, -1).replace(/\./g, "-");
				}

				// プリミティブ参照を解決: Brand-800 -> #2c2c2c
				if (primitiveLookup[finalValue]) {
					finalValue = primitiveLookup[finalValue];
				}

				// タイプとトークン名で分類
				const lowerName = tokenName.toLowerCase();

				if (type === "color" || lowerName.includes("color")) {
					tokens.colors![tokenName] = finalValue;
				} else if (
					lowerName.includes("space") ||
					lowerName.includes("spacing")
				) {
					// Spacing: px単位を追加（数値のみの場合）
					const value = /^\d+$/.test(finalValue)
						? `${finalValue}px`
						: finalValue;
					tokens.spacing![tokenName] = value;
				} else if (lowerName.includes("font") && lowerName.includes("size")) {
					// Font Size: px単位を追加（数値のみの場合）
					const value = /^\d+$/.test(finalValue)
						? `${finalValue}px`
						: finalValue;
					tokens.fontSize![tokenName] = value;
				} else if (lowerName.includes("font") && lowerName.includes("weight")) {
					tokens.fontWeight![tokenName] = finalValue;
				} else if (lowerName.includes("line") && lowerName.includes("height")) {
					tokens.lineHeight![tokenName] = finalValue;
				} else if (type === "number" && lowerName.includes("size")) {
					// その他のサイズ系（具体的な用途が不明な場合はspacing扱い）
					const value = /^\d+$/.test(finalValue)
						? `${finalValue}px`
						: finalValue;
					tokens.spacing![tokenName] = value;
				}
			} else {
				// グループなので再帰
				traverse(value as TokenGroup, tokenName);
			}
		}
	}

	traverse(tokenData);
	return tokens;
}

async function main() {
	console.log("🔌 Figma Plugin エクスポートファイルを読み込み中...");

	const tokensDir = path.resolve(process.cwd(), "design-tokens");
	const rawDir = path.resolve(tokensDir, "raw");
	const outputPath = path.resolve(tokensDir, "figma-raw.json");

	// design-tokens/raw/ ディレクトリ内の全JSONファイルを読み込み
	if (!fs.existsSync(rawDir)) {
		console.error(`\n❌ ${rawDir} ディレクトリが見つかりません`);
		console.error("\n📋 以下の手順でファイルを配置してください:");
		console.error("   1. Figmaで対象ファイルを開く");
		console.error("   2. プラグイン → Design Tokens (W3C) Export を実行");
		console.error(
			"   3. エクスポートされたZIPまたはJSONファイルをダウンロード",
		);
		console.error(`   4. ${rawDir}/ に配置（ZIPの場合は解凍）`);
		process.exit(1);
	}

	const jsonFiles = fs.readdirSync(rawDir).filter((f) => f.endsWith(".json"));

	if (jsonFiles.length === 0) {
		console.error(`\n❌ ${tokensDir} にJSONファイルが見つかりません`);
		console.error("\n📋 以下の手順でファイルを配置してください:");
		console.error("   1. Figmaで対象ファイルを開く");
		console.error("   2. プラグイン → Design Tokens (W3C) Export を実行");
		console.error(
			"   3. エクスポートされたZIPまたはJSONファイルをダウンロード",
		);
		console.error(`   4. ${tokensDir}/ に配置（ZIPの場合は解凍）`);
		process.exit(1);
	}

	try {
		console.log(`\n📂 読み込むファイル: ${jsonFiles.length} 個`);
		jsonFiles.forEach((f) => console.log(`   - ${f}`));

		// Step 1: プリミティブトークンの辞書を構築
		console.log(`\n🔧 プリミティブトークンを読み込み中...`);
		let primitiveLookup: Record<string, string> = {};

		const primitiveFiles = jsonFiles.filter((f) => f.includes("primitive"));
		for (const file of primitiveFiles) {
			const filePath = path.resolve(rawDir, file);
			const tokenData: TokenGroup = JSON.parse(
				fs.readFileSync(filePath, "utf-8"),
			);
			const lookup = buildPrimitiveLookup(tokenData);
			primitiveLookup = { ...primitiveLookup, ...lookup };
			console.log(`   - ${file}: ${Object.keys(lookup).length} トークン`);
		}

		console.log(
			`\n📊 プリミティブトークン総数: ${Object.keys(primitiveLookup).length} 個`,
		);

		// Step 2: 全てのトークンを統合（参照解決付き）
		console.log(`\n🔄 トークンを変換中...`);
		let allTokens: Partial<DesignTokens> = {
			colors: {},
			spacing: {},
			fontSize: {},
			fontWeight: {},
			lineHeight: {},
		};

		for (const file of jsonFiles) {
			const filePath = path.resolve(rawDir, file);
			console.log(`   - raw/${file}`);

			const tokenData: TokenGroup = JSON.parse(
				fs.readFileSync(filePath, "utf-8"),
			);
			const converted = convertTokens(tokenData, primitiveLookup);

			// マージ
			allTokens.colors = { ...allTokens.colors, ...converted.colors };
			allTokens.spacing = { ...allTokens.spacing, ...converted.spacing };
			allTokens.fontSize = { ...allTokens.fontSize, ...converted.fontSize };
			allTokens.fontWeight = {
				...allTokens.fontWeight,
				...converted.fontWeight,
			};
			allTokens.lineHeight = {
				...allTokens.lineHeight,
				...converted.lineHeight,
			};
		}

		// Step 3: セマンティックトークン内の参照を解決
		console.log(`\n🔗 セマンティックトークン内の参照を解決中...`);

		// 全トークンを参照辞書に統合
		const semanticLookup: Record<string, string> = {
			...primitiveLookup,
			...allTokens.colors,
			...allTokens.spacing,
			...allTokens.fontSize,
			...allTokens.fontWeight,
			...allTokens.lineHeight,
		};

		// 複数回参照解決（最大3回）
		for (let i = 0; i < 3; i++) {
			let resolved = 0;

			// 各カテゴリの参照を解決
			for (const [key, value] of Object.entries(allTokens.colors || {})) {
				if (semanticLookup[value] && semanticLookup[value] !== value) {
					allTokens.colors![key] = semanticLookup[value];
					resolved++;
				}
			}
			for (const [key, value] of Object.entries(allTokens.spacing || {})) {
				if (semanticLookup[value] && semanticLookup[value] !== value) {
					allTokens.spacing![key] = semanticLookup[value];
					resolved++;
				}
			}
			for (const [key, value] of Object.entries(allTokens.fontSize || {})) {
				if (semanticLookup[value] && semanticLookup[value] !== value) {
					allTokens.fontSize![key] = semanticLookup[value];
					resolved++;
				}
			}
			for (const [key, value] of Object.entries(allTokens.fontWeight || {})) {
				if (semanticLookup[value] && semanticLookup[value] !== value) {
					allTokens.fontWeight![key] = semanticLookup[value];
					resolved++;
				}
			}
			for (const [key, value] of Object.entries(allTokens.lineHeight || {})) {
				if (semanticLookup[value] && semanticLookup[value] !== value) {
					allTokens.lineHeight![key] = semanticLookup[value];
					resolved++;
				}
			}

			console.log(`   - パス${i + 1}: ${resolved} 個の参照を解決`);

			if (resolved === 0) break; // これ以上解決できない

			// 辞書を更新
			Object.assign(
				semanticLookup,
				allTokens.colors,
				allTokens.spacing,
				allTokens.fontSize,
				allTokens.fontWeight,
				allTokens.lineHeight,
			);
		}

		// 既存の fetch-tokens.ts と同じ形式で保存
		fs.writeFileSync(
			outputPath,
			JSON.stringify(
				{
					generatedAt: new Date().toISOString(),
					fileKey: "plugin-export",
					source: "figma-plugin",
					sourceFiles: jsonFiles,
					tokens: allTokens,
				},
				null,
				2,
			),
		);

		console.log(`\n💾 デザイントークンを統合・変換しました`);
		console.log(`   Output: ${outputPath}`);
		console.log(`\n📊 統合したトークン:`);
		console.log(`   Colors: ${Object.keys(allTokens.colors || {}).length} 個`);
		console.log(
			`   Spacing: ${Object.keys(allTokens.spacing || {}).length} 個`,
		);
		console.log(
			`   Font Size: ${Object.keys(allTokens.fontSize || {}).length} 個`,
		);
		console.log(
			`   Font Weight: ${Object.keys(allTokens.fontWeight || {}).length} 個`,
		);
		console.log(
			`   Line Height: ${Object.keys(allTokens.lineHeight || {}).length} 個`,
		);

		console.log("\n✨ 完了！次は 'pnpm run figma:generate' を実行してください");
	} catch (error) {
		console.error("\n❌ エラーが発生しました:");
		console.error(error);
		process.exit(1);
	}
}

main();
