"use client";

import TextTitleHero from "@/features/shared/figma_generated/TextTitleHero";
import TextTitlePage from "@/features/shared/figma_generated/TextTitlePage";
import TextSubtitle from "@/features/shared/figma_generated/TextSubtitle";
import TextHeading from "@/features/shared/figma_generated/TextHeading";
import TextSubheading from "@/features/shared/figma_generated/TextSubheading";
import Text from "@/features/shared/figma_generated/Text";
import TextEmphasis from "@/features/shared/figma_generated/TextEmphasis";
import TextLink from "@/features/shared/figma_generated/TextLink";
import TextStrong from "@/features/shared/figma_generated/TextStrong";
import TextCode from "@/features/shared/figma_generated/TextCode";
import TextSmall from "@/features/shared/figma_generated/TextSmall";

export default function TypographyDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Typography Components</h1>
          <p className="text-foreground-secondary">Figmaから取り込んだテキストコンポーネント一覧</p>
        </div>

        {/* Title Hero */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Title Hero</h2>
            <span className="text-sm text-foreground-secondary">72px, Bold</span>
          </div>
          <TextTitleHero text="Text Title Hero" />
        </div>

        {/* Title Page */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Title Page</h2>
            <span className="text-sm text-foreground-secondary">48px, Bold</span>
          </div>
          <TextTitlePage text="Text Title Page" />
        </div>

        {/* Subtitle */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Subtitle</h2>
            <span className="text-sm text-foreground-secondary">32px, Regular</span>
          </div>
          <TextSubtitle text="Text Subtitle" />
        </div>

        {/* Heading */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Heading</h2>
            <span className="text-sm text-foreground-secondary">24px, Semi Bold</span>
          </div>
          <TextHeading text="Text Heading" />
        </div>

        {/* Subheading */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Subheading</h2>
            <span className="text-sm text-foreground-secondary">20px, Regular</span>
          </div>
          <TextSubheading text="Text Subheading" />
        </div>

        {/* Body Variants */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Body Text Variants</h2>
            <span className="text-sm text-foreground-secondary">16px</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground-secondary w-32">Text (Regular)</span>
              <Text text="Text" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground-secondary w-32">Text Emphasis</span>
              <TextEmphasis text="Text Emphasis" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground-secondary w-32">Text Link</span>
              <TextLink text="Text Link" href="#" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground-secondary w-32">Text Strong</span>
              <TextStrong text="Text Strong" />
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Code</h2>
            <span className="text-sm text-foreground-secondary">16px, Roboto Mono</span>
          </div>
          <TextCode text="Text Code" />
        </div>

        {/* Small */}
        <div className="space-y-4 pb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-foreground">Text Small</h2>
            <span className="text-sm text-foreground-secondary">14px, Regular</span>
          </div>
          <TextSmall text="Text Small" />
        </div>
      </div>
    </div>
  );
}
