import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import type {
	FigmaVariablesResponse,
	FigmaFileStylesResponse,
	DesignTokens,
	FigmaVariable,
} from "./types";

// .env.local を読み込み
config({ path: path.resolve(process.cwd(), ".env.local") });

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_ACCESS_TOKEN) {
	console.error("❌ FIGMA_ACCESS_TOKEN が設定されていません");
	console.error(
		"   .env.local に FIGMA_ACCESS_TOKEN=your_token を追加してください",
	);
	process.exit(1);
}

if (!FIGMA_FILE_KEY) {
	console.error("❌ FIGMA_FILE_KEY が設定されていません");
	console.error(
		"   .env.local に FIGMA_FILE_KEY=your_file_key を追加してください",
	);
	process.exit(1);
}

const FIGMA_API_BASE = "https://api.figma.com/v1";

async function fetchFigmaVariables(): Promise<FigmaVariablesResponse> {
	const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/variables/local`;

	console.log(`\n📡 Figma Variables API を呼び出しています...`);
	console.log(`   URL: ${url}`);

	const response = await fetch(url, {
		headers: {
			"X-Figma-Token": FIGMA_ACCESS_TOKEN as string,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Figma API エラー: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}

async function fetchFigmaStyles(): Promise<FigmaFileStylesResponse> {
	const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/styles`;

	console.log(`\n📡 Figma Styles API を呼び出しています...`);
	console.log(`   URL: ${url}`);

	const response = await fetch(url, {
		headers: {
			"X-Figma-Token": FIGMA_ACCESS_TOKEN as string,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Figma API エラー: ${response.status} ${response.statusText}`,
		);
	}

	return response.json();
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
	const toHex = (value: number) =>
		Math.round(value * 255)
			.toString(16)
			.padStart(2, "0");

	if (a < 1) {
		return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
	}
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function convertVariablesToTokens(
	variablesResponse: FigmaVariablesResponse,
): Partial<DesignTokens> {
	const tokens: Partial<DesignTokens> = {
		colors: {},
		spacing: {},
		fontSize: {},
		fontWeight: {},
		lineHeight: {},
	};

	const { variables, variableCollections } = variablesResponse.meta;

	// 各コレクションのデフォルトモードを取得
	const collectionModes = Object.values(variableCollections).reduce(
		(acc, collection) => {
			acc[collection.id] = collection.defaultModeId;
			return acc;
		},
		{} as Record<string, string>,
	);

	for (const variable of Object.values(variables)) {
		const defaultModeId = collectionModes[variable.variableCollectionId];
		const value = variable.valuesByMode[defaultModeId];

		// Variable name をケバブケースに変換（例: color/primary → color-primary）
		const tokenName = variable.name.replace(/\//g, "-").toLowerCase();

		if (
			variable.resolvedType === "COLOR" &&
			typeof value === "object" &&
			"r" in value
		) {
			tokens.colors![tokenName] = rgbaToHex(value.r, value.g, value.b, value.a);
		} else if (variable.resolvedType === "FLOAT") {
			// Spacing, fontSize, lineHeight を推測
			if (tokenName.includes("spacing") || tokenName.includes("space")) {
				tokens.spacing![tokenName] = `${value}px`;
			} else if (
				tokenName.includes("font-size") ||
				tokenName.includes("text")
			) {
				tokens.fontSize![tokenName] = `${value}px`;
			} else if (tokenName.includes("line-height")) {
				tokens.lineHeight![tokenName] = `${value}`;
			}
		} else if (
			variable.resolvedType === "STRING" &&
			typeof value === "string"
		) {
			if (tokenName.includes("font-weight") || tokenName.includes("weight")) {
				tokens.fontWeight![tokenName] = value;
			}
		}
	}

	return tokens;
}

async function main() {
	console.log("🎨 Figma デザイントークン取得開始");
	console.log(`   File Key: ${FIGMA_FILE_KEY}`);

	try {
		// Variables を取得
		const variablesResponse = await fetchFigmaVariables();
		console.log(
			`\n✅ Variables 取得成功: ${Object.keys(variablesResponse.meta.variables).length} 個`,
		);

		// トークンに変換
		const tokens = convertVariablesToTokens(variablesResponse);

		// JSON として保存
		const outputPath = path.resolve(
			process.cwd(),
			"design-tokens/figma-raw.json",
		);
		fs.writeFileSync(
			outputPath,
			JSON.stringify(
				{
					generatedAt: new Date().toISOString(),
					fileKey: FIGMA_FILE_KEY,
					variables: variablesResponse.meta.variables,
					variableCollections: variablesResponse.meta.variableCollections,
					tokens,
				},
				null,
				2,
			),
		);

		console.log(`\n💾 デザイントークンを保存しました`);
		console.log(`   Path: ${outputPath}`);
		console.log(`\n📊 取得したトークン:`);
		console.log(`   Colors: ${Object.keys(tokens.colors || {}).length} 個`);
		console.log(`   Spacing: ${Object.keys(tokens.spacing || {}).length} 個`);
		console.log(
			`   Font Size: ${Object.keys(tokens.fontSize || {}).length} 個`,
		);
		console.log(
			`   Font Weight: ${Object.keys(tokens.fontWeight || {}).length} 個`,
		);
		console.log(
			`   Line Height: ${Object.keys(tokens.lineHeight || {}).length} 個`,
		);

		console.log("\n✨ 完了！次は 'pnpm run figma:generate' を実行してください");
	} catch (error) {
		console.error("\n❌ エラーが発生しました:");
		console.error(error);
		process.exit(1);
	}
}

main();
