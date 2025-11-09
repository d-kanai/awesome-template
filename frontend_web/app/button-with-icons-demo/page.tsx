"use client";

import ButtonWithIcons from "@/features/shared/figma_generated/ButtonWithIcons";
import StarIcon from "@/features/shared/components/icons/StarIcon";
import XIcon from "@/features/shared/components/icons/XIcon";

export default function ButtonWithIconsDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Button With Icons Component</h1>
          <p className="text-foreground-secondary">Figmaから取り込んだButtonコンポーネント（アイコン対応版）</p>
        </div>

        {/* Primary Buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Primary Variant</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Medium</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="primary" size="medium">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="medium" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="medium" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="medium" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Small</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="primary" size="small">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="small" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="small" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" size="small" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Disabled</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="primary" disabled>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="primary" disabled leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
          </div>
        </div>

        {/* Neutral Buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Neutral Variant</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Medium</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="neutral" size="medium">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="medium" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="medium" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="medium" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Small</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="neutral" size="small">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="small" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="small" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" size="small" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Disabled</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="neutral" disabled>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="neutral" disabled leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Buttons */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Subtle Variant</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Medium</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="subtle" size="medium">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="medium" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="medium" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="medium" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Small</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="subtle" size="small">
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="small" leftIcon={<StarIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="small" rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" size="small" leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">Disabled</p>
              <div className="flex gap-2">
                <ButtonWithIcons variant="subtle" disabled>
                  Button
                </ButtonWithIcons>
                <ButtonWithIcons variant="subtle" disabled leftIcon={<StarIcon />} rightIcon={<XIcon />}>
                  Button
                </ButtonWithIcons>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Interactive Example</h2>
          <div className="flex gap-2">
            <ButtonWithIcons
              variant="primary"
              leftIcon={<StarIcon />}
              onClick={() => alert("Primary button clicked!")}
            >
              Click Me
            </ButtonWithIcons>
            <ButtonWithIcons
              variant="neutral"
              rightIcon={<XIcon />}
              onClick={() => alert("Neutral button clicked!")}
            >
              Close
            </ButtonWithIcons>
            <ButtonWithIcons
              variant="subtle"
              leftIcon={<StarIcon />}
              rightIcon={<XIcon />}
              onClick={() => alert("Subtle button clicked!")}
            >
              Action
            </ButtonWithIcons>
          </div>
        </div>
      </div>
    </div>
  );
}
