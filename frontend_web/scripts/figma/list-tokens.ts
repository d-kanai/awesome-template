import { figmaTokens } from "../../design-tokens/tailwind-tokens";

console.log("🎨 Figma Design Tokens 一覧\n");

console.log("📦 Colors:", Object.keys(figmaTokens.colors).length, "個");
console.log("主要なトークン:");
Object.entries(figmaTokens.colors)
	.filter(
		([key]) => key.includes("Background-Brand") || key.includes("Text-Brand"),
	)
	.slice(0, 10)
	.forEach(([key, value]) => {
		console.log(`  ${key}: ${value}`);
	});

console.log("\n📏 Spacing:", Object.keys(figmaTokens.spacing).length, "個");
Object.entries(figmaTokens.spacing)
	.filter(([key]) => key.startsWith("Space-"))
	.slice(0, 10)
	.forEach(([key, value]) => {
		console.log(`  ${key}: ${value}`);
	});

console.log("\n✍️  Font Size:", Object.keys(figmaTokens.fontSize).length, "個");
Object.entries(figmaTokens.fontSize).forEach(([key, value]) => {
	console.log(`  ${key}: ${value}`);
});

console.log(
	"\n🔠 Font Weight:",
	Object.keys(figmaTokens.fontWeight).length,
	"個",
);
Object.entries(figmaTokens.fontWeight).forEach(([key, value]) => {
	console.log(`  ${key}: ${value}`);
});
