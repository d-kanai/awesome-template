import { figmaTokens } from "../../design-tokens/tailwind-tokens";

console.log("🎨 Figma Design Tokens 一覧\n");

console.log("📦 Colors:", Object.keys(figmaTokens.colors).length, "個");
console.log("主要なトークン:");
const colorEntries = Object.entries(figmaTokens.colors)
  .filter(
    ([key]) => key.includes("Background-Brand") || key.includes("Text-Brand"),
  )
  .slice(0, 10);
for (const [key, value] of colorEntries) {
  console.log(`  ${key}: ${value}`);
}

console.log("\n📏 Spacing:", Object.keys(figmaTokens.spacing).length, "個");
const spacingEntries = Object.entries(figmaTokens.spacing)
  .filter(([key]) => key.startsWith("Space-"))
  .slice(0, 10);
for (const [key, value] of spacingEntries) {
  console.log(`  ${key}: ${value}`);
}

console.log("\n✍️  Font Size:", Object.keys(figmaTokens.fontSize).length, "個");
for (const [key, value] of Object.entries(figmaTokens.fontSize)) {
  console.log(`  ${key}: ${value}`);
}

console.log(
  "\n🔠 Font Weight:",
  Object.keys(figmaTokens.fontWeight).length,
  "個",
);
for (const [key, value] of Object.entries(figmaTokens.fontWeight)) {
  console.log(`  ${key}: ${value}`);
}
