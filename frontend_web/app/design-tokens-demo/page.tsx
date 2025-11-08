import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

export default function DesignTokensDemoPage() {
  return (
    <div className="relative min-h-screen bg-background p-Space-800">
      <div className="absolute right-Space-800 top-Space-800">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-Space-600">
        {/* Header */}
        <header className="space-y-Space-400">
          <h1 className="text-[48px] font-[700] text-primary">
            Figma Design Tokens Demo
          </h1>
          <p className="text-[16px] text-foreground-secondary">
            Figmaから取り込んだデザイントークンを実際に使用したデモページ
          </p>
        </header>

        {/* 使い方の説明 */}
        <section className="bg-muted p-Space-600 rounded">
          <h2 className="text-[24px] font-[600] mb-Space-400 text-primary">
            🎨 使い方の比較
          </h2>
          <div className="space-y-Space-300 text-[14px]">
            <div>
              <div className="font-[600] mb-Space-200">❌ Before（統合前）</div>
              <code className="block bg-background p-Space-300 rounded border border-border">
                {`<div className="bg-[#2c2c2c] text-[#ffffff]" />`}
              </code>
            </div>
            <div>
              <div className="font-[600] mb-Space-200">
                ✅ After（統合後）- セマンティック名
              </div>
              <code className="block bg-background p-Space-300 rounded border border-border">
                {`<div className="bg-primary text-primary-foreground" />`}
              </code>
            </div>
            <div>
              <div className="font-[600] mb-Space-200">
                ✅ After（統合後）- Spacing
              </div>
              <code className="block bg-background p-Space-300 rounded border border-border">
                {`<div className="p-Space-400 m-Space-800" />`}
              </code>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-Space-400">
          <h2 className="text-[32px] font-[600] text-foreground">
            Color Palette（セマンティック名）
          </h2>

          <div className="space-y-Space-400">
            {/* Brand Colors */}
            <div>
              <h3 className="text-[20px] font-[600] mb-Space-300">Brand</h3>
              <div className="grid grid-cols-4 gap-Space-300">
                <ColorSwatch color="bg-primary" name="Primary" />
                <ColorSwatch color="bg-primary-hover" name="Primary Hover" />
                <ColorSwatch color="bg-secondary" name="Secondary" />
                <ColorSwatch color="bg-muted" name="Muted" />
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h3 className="text-[20px] font-[600] mb-Space-300">Status</h3>
              <div className="grid grid-cols-3 gap-Space-300">
                <ColorSwatch color="bg-success" name="Success" />
                <ColorSwatch color="bg-warning" name="Warning" />
                <ColorSwatch color="bg-destructive" name="Destructive" />
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-Space-400">
          <h2 className="text-[32px] font-[600] text-foreground">
            Spacing（Figmaトークン）
          </h2>
          <div className="space-y-Space-300">
            <SpacingDemo size="4px" label="Space-100" />
            <SpacingDemo size="8px" label="Space-200" />
            <SpacingDemo size="16px" label="Space-400" />
            <SpacingDemo size="24px" label="Space-600" />
            <SpacingDemo size="32px" label="Space-800" />
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-Space-400">
          <h2 className="text-[32px] font-[600] text-foreground">Typography</h2>
          <div className="space-y-Space-400">
            <div>
              <p className="text-[72px] font-[700] text-foreground">
                Title Hero (72px/700)
              </p>
            </div>
            <div>
              <p className="text-[48px] font-[700] text-foreground">
                Title Page (48px/700)
              </p>
            </div>
            <div>
              <p className="text-[32px] font-[400] text-foreground">
                Subtitle (32px/400)
              </p>
            </div>
            <div>
              <p className="text-[24px] font-[600] text-foreground">
                Heading (24px/600)
              </p>
            </div>
            <div>
              <p className="text-[16px] font-[400] text-foreground">
                Body (16px/400)
              </p>
            </div>
          </div>
        </section>

        {/* Button Examples */}
        <section className="space-y-Space-400">
          <h2 className="text-[32px] font-[600] text-foreground">
            Buttons（セマンティック名）
          </h2>
          <div className="flex gap-Space-400">
            <button
              type="button"
              className="px-Space-600 py-Space-300 bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors"
            >
              Primary Button
            </button>
            <button
              type="button"
              className="px-Space-600 py-Space-300 bg-success text-success-foreground rounded hover:bg-success-hover transition-colors"
            >
              Success Button
            </button>
            <button
              type="button"
              className="px-Space-600 py-Space-300 bg-destructive text-destructive-foreground rounded hover:bg-destructive-hover transition-colors"
            >
              Destructive Button
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorSwatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="space-y-Space-200">
      <div className={`${color} h-24 rounded border border-border`} />
      <div className="text-[14px]">
        <div className="font-[600] text-foreground">{name}</div>
      </div>
    </div>
  );
}

function SpacingDemo({ size, label }: { size: string; label: string }) {
  return (
    <div className="flex items-center gap-Space-400">
      <div className="w-32 text-[14px] font-[600] text-foreground">{label}</div>
      <div className="bg-success h-8" style={{ width: size }} />
      <div className="text-[14px] text-foreground-secondary">{size}</div>
    </div>
  );
}
