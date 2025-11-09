"use client";

import Tooltip from "@/features/shared/figma_generated/Tooltip";

export default function TooltipDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Tooltip Component</h1>
          <p className="text-foreground-secondary">Figmaから取り込んだTooltipコンポーネント</p>
        </div>

        {/* Placement=Top */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Placement: Top</h2>
          <div className="flex justify-center items-center h-32 bg-background-secondary rounded-lg">
            <Tooltip placement="Top" title="Tooltip Title" body="This is the body text" />
          </div>
        </div>

        {/* Placement=Bottom */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Placement: Bottom</h2>
          <div className="flex justify-center items-center h-32 bg-background-secondary rounded-lg">
            <Tooltip placement="Bottom" title="Tooltip Title" body="This is the body text" />
          </div>
        </div>

        {/* Placement=Left */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Placement: Left</h2>
          <div className="flex justify-center items-center h-32 bg-background-secondary rounded-lg">
            <Tooltip placement="Left" title="Tooltip Title" body="This is the body text" />
          </div>
        </div>

        {/* Placement=Right */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Placement: Right</h2>
          <div className="flex justify-center items-center h-32 bg-background-secondary rounded-lg">
            <Tooltip placement="Right" title="Tooltip Title" body="This is the body text" />
          </div>
        </div>

        {/* Without Body */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Without Body Text</h2>
          <div className="flex justify-center items-center h-32 bg-background-secondary rounded-lg">
            <Tooltip placement="Top" title="Short Tooltip" hasBody={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
