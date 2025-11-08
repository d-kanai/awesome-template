"use client";

import styles from "@/design-tokens/figma-styles.json";
import { figmaTokens } from "@/design-tokens/tailwind-tokens";
import { useState } from "react";

export default function FigmaStylesPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    variables: true,
    spacing: false,
    textStyles: false,
    colorStyles: false,
    effectStyles: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  // Group colors by category
  const colorCategories: Record<string, Record<string, string>> = {};
  for (const [key, value] of Object.entries(figmaTokens.colors)) {
    const parts = key.split("-");
    const theme = parts[0]; // sds_light or sds_dark
    const category = parts.slice(1, 3).join("-"); // Background-Default, Text-Brand, etc.
    const categoryKey = `${theme}/${category}`;

    if (!colorCategories[categoryKey]) {
      colorCategories[categoryKey] = {};
    }
    colorCategories[categoryKey][key] = value;
  }

  const totalTokens =
    Object.keys(figmaTokens.colors).length +
    Object.keys(figmaTokens.spacing).length +
    styles.textStyles.length +
    styles.colorStyles.length +
    styles.effectStyles.length;

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Figma Design Tokens Showcase
        </h1>
        <div className="flex gap-4 text-sm mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded">
            <span className="font-semibold">{totalTokens}</span> Total Tokens
          </div>
          <div className="bg-green-50 px-4 py-2 rounded">
            <span className="font-semibold">
              {Object.keys(figmaTokens.colors).length}
            </span>{" "}
            Variables
          </div>
          <div className="bg-purple-50 px-4 py-2 rounded">
            <span className="font-semibold">
              {styles.textStyles.length +
                styles.colorStyles.length +
                styles.effectStyles.length}
            </span>{" "}
            Styles
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-3">目次 / Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Variables Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                  Variables
                </span>
                <span className="text-gray-600">Figma Plugin経由</span>
              </h3>
              <ul className="space-y-2 text-sm pl-2">
                <li>
                  <a
                    href="#variables"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    → Color Tokens ({Object.keys(figmaTokens.colors).length})
                  </a>
                </li>
                <li>
                  <a
                    href="#spacing"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    → Spacing Tokens ({Object.keys(figmaTokens.spacing).length})
                  </a>
                </li>
              </ul>
            </div>

            {/* Styles Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs">
                  Styles
                </span>
                <span className="text-gray-600">Figma REST API経由</span>
              </h3>
              <ul className="space-y-2 text-sm pl-2">
                <li>
                  <a
                    href="#text-styles"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    → Text Styles ({styles.textStyles.length})
                  </a>
                </li>
                <li>
                  <a
                    href="#color-styles"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    → Color Styles ({styles.colorStyles.length})
                  </a>
                </li>
                <li>
                  <a
                    href="#effect-styles"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    → Effect Styles ({styles.effectStyles.length})
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Variables (Design Tokens) */}
      <section
        id="variables"
        className="mb-12 border-2 border-green-200 rounded-lg bg-green-50"
      >
        <button
          type="button"
          onClick={() => toggleSection("variables")}
          className="w-full text-left p-4 hover:bg-green-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
              Variables
            </span>
            <h2 className="text-2xl font-bold">
              Color Tokens ({Object.keys(figmaTokens.colors).length})
            </h2>
          </div>
          <span className="text-2xl">{openSections.variables ? "−" : "+"}</span>
        </button>
        {openSections.variables && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-600 mb-6">
              Figma Variablesから取得した色トークン (Plugin経由)
            </p>
            <div className="space-y-8">
              {Object.entries(colorCategories).map(([category, colors]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-3 rounded">
                    {category} ({Object.keys(colors).length} colors)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(colors).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div
                          className="w-full h-16 rounded-lg border mb-2 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div
                          className="text-xs font-mono truncate px-1"
                          title={name}
                        >
                          {name.split("-").slice(-2).join("-")}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {color}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Spacing Tokens */}
      <section
        id="spacing"
        className="mb-12 border-2 border-green-200 rounded-lg bg-green-50"
      >
        <button
          type="button"
          onClick={() => toggleSection("spacing")}
          className="w-full text-left p-4 hover:bg-green-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
              Variables
            </span>
            <h2 className="text-2xl font-bold">
              Spacing Tokens ({Object.keys(figmaTokens.spacing).length})
            </h2>
          </div>
          <span className="text-2xl">{openSections.spacing ? "−" : "+"}</span>
        </button>
        {openSections.spacing && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-600 mb-6">
              Figma Variablesから取得したスペーシングトークン
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(figmaTokens.spacing).map(([name, value]) => (
                <div key={name} className="border rounded-lg p-4">
                  <div className="text-sm font-semibold mb-2">{name}</div>
                  <div className="text-xs text-gray-500 font-mono mb-3">
                    {value}
                  </div>
                  <div className="flex items-end">
                    <div
                      className="bg-blue-500 rounded"
                      style={{
                        width: value,
                        height: value,
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Text Styles */}
      <section
        id="text-styles"
        className="mb-12 border-2 border-purple-200 rounded-lg bg-purple-50"
      >
        <button
          type="button"
          onClick={() => toggleSection("textStyles")}
          className="w-full text-left p-4 hover:bg-purple-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-semibold">
              Styles
            </span>
            <h2 className="text-2xl font-bold">
              Text Styles ({styles.textStyles.length})
            </h2>
          </div>
          <span className="text-2xl">
            {openSections.textStyles ? "−" : "+"}
          </span>
        </button>
        {openSections.textStyles && (
          <div className="p-4 border-t">
            <div className="space-y-6">
              {styles.textStyles.map((textStyle) => {
                const className = `text-${textStyle.name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")}`;
                return (
                  <div key={textStyle.key} className="p-4 border rounded-lg">
                    <div className="mb-2 text-sm text-gray-600">
                      <strong>{textStyle.name}</strong>
                      {textStyle.description && ` - ${textStyle.description}`}
                    </div>
                    <div className="mb-2 text-xs text-gray-500 font-mono">
                      className: {className}
                    </div>
                    <div className="mb-2 text-xs text-gray-500">
                      {textStyle.style.fontFamily} {textStyle.style.fontSize}px
                      / {textStyle.style.fontWeight} /{" "}
                      {textStyle.style.lineHeightPx?.toFixed(1)}px
                    </div>
                    <div className={className}>
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Color Styles */}
      <section
        id="color-styles"
        className="mb-12 border-2 border-purple-200 rounded-lg bg-purple-50"
      >
        <button
          type="button"
          onClick={() => toggleSection("colorStyles")}
          className="w-full text-left p-4 hover:bg-purple-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-semibold">
              Styles
            </span>
            <h2 className="text-2xl font-bold">
              Color Styles ({styles.colorStyles.length})
            </h2>
          </div>
          <span className="text-2xl">
            {openSections.colorStyles ? "−" : "+"}
          </span>
        </button>
        {openSections.colorStyles && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.colorStyles.map((colorStyle) => (
                <div key={colorStyle.key} className="text-center">
                  <div
                    className="w-full h-24 rounded-lg border mb-2"
                    style={{ backgroundColor: colorStyle.color }}
                  />
                  <div className="text-sm font-semibold">{colorStyle.name}</div>
                  <div className="text-xs text-gray-500 font-mono">
                    {colorStyle.color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Effect Styles */}
      <section
        id="effect-styles"
        className="mb-12 border-2 border-purple-200 rounded-lg bg-purple-50"
      >
        <button
          type="button"
          onClick={() => toggleSection("effectStyles")}
          className="w-full text-left p-4 hover:bg-purple-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-semibold">
              Styles
            </span>
            <h2 className="text-2xl font-bold">
              Effect Styles ({styles.effectStyles.length})
            </h2>
          </div>
          <span className="text-2xl">
            {openSections.effectStyles ? "−" : "+"}
          </span>
        </button>
        {openSections.effectStyles && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {styles.effectStyles.map((effectStyle) => {
                const dropShadows = effectStyle.effects
                  .filter(
                    (e) =>
                      e.type === "DROP_SHADOW" && e.visible && "color" in e,
                  )
                  .map((e: any) => {
                    const r = Math.round((e.color?.r || 0) * 255);
                    const g = Math.round((e.color?.g || 0) * 255);
                    const b = Math.round((e.color?.b || 0) * 255);
                    const a = e.color?.a || 0;
                    return `${e.offset?.x || 0}px ${e.offset?.y || 0}px ${e.radius || 0}px rgba(${r}, ${g}, ${b}, ${a})`;
                  })
                  .join(", ");

                const hasDropShadow = dropShadows.length > 0;
                const isBlur = effectStyle.effects.some(
                  (e) =>
                    e.type === "BACKGROUND_BLUR" || e.type === "LAYER_BLUR",
                );

                return (
                  <div key={effectStyle.key} className="text-center">
                    <div className="p-8 mb-2 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div
                        className="w-24 h-24 rounded-lg bg-white border flex items-center justify-center text-xs"
                        style={hasDropShadow ? { boxShadow: dropShadows } : {}}
                      >
                        {isBlur ? "Blur" : "Shadow"}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {effectStyle.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {effectStyle.effects[0]?.type.replace("_", " ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Usage Info */}
      <section className="mb-12 p-6 bg-blue-50 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">使い方 / データソースの違い</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                Variables
              </span>
              Figma Variables
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>取得方法:</strong> Figma Plugin経由でエクスポート
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>内容:</strong> Color Tokens、Spacing Tokens
            </p>
            <p className="text-sm text-gray-700">
              <strong>用途:</strong>{" "}
              デザインシステムの基礎となるプリミティブトークン
            </p>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-300">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs">
                Styles
              </span>
              Figma Styles
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>取得方法:</strong> Figma REST API経由で取得
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>内容:</strong> Text Styles、Color Styles、Effect Styles
            </p>
            <p className="text-sm text-gray-700">
              <strong>用途:</strong>{" "}
              コンポーネントに適用する具体的なスタイル定義
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm border-t pt-4">
          <h3 className="font-semibold mb-2">コード内での使用方法</h3>
          <p>
            <strong>Text Styles:</strong> クラス名{" "}
            <code className="bg-white px-2 py-1 rounded">
              .text-{"{style-name}"}
            </code>{" "}
            で使用
          </p>
          <p>
            <strong>Color Styles:</strong> CSS変数{" "}
            <code className="bg-white px-2 py-1 rounded">
              --color-{"{style-name}"}
            </code>{" "}
            で使用
          </p>
          <p>
            <strong>Effect Styles:</strong> CSS変数{" "}
            <code className="bg-white px-2 py-1 rounded">
              --shadow-{"{style-name}"}
            </code>{" "}
            で使用
          </p>
        </div>
      </section>
    </div>
  );
}
