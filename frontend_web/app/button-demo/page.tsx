"use client";

import { ButtonNew } from "@/features/shared/figma_generated/ButtonNew";

export default function ButtonDemoPage() {
  return (
    <div className="min-h-screen bg-background p-Space-800">
      <div className="mx-auto max-w-6xl space-y-Space-800">
        <div>
          <h1 className="text-title-page">Figma Button Demo</h1>
          <p className="text-body-base text-foreground-secondary mt-Space-400">
            Figma REST APIから取得したComponentPropertyDefinitionsを完全再現
          </p>
          <div className="mt-Space-200 text-body-small text-foreground-tertiary">
            Variant (3) × Size (2) × Icon (3) × State (2) = 36 patterns
          </div>
          <div className="mt-Space-200 text-body-small text-foreground-tertiary">
            API取得プロパティ: Variant, State, Size (VARIANT) + Label (TEXT) +
            Has Icon Start/End (BOOLEAN)
          </div>
        </div>

        {/* Primary Variant */}
        <section className="space-y-Space-600">
          <h2 className="text-heading">Primary Variant</h2>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Medium Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="primary" size="medium" label="Button" />
              <ButtonNew
                variant="primary"
                size="medium"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="primary"
                size="medium"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="primary"
                size="medium"
                label="Button"
                disabled
              />
            </div>
          </div>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Small Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="primary" size="small" label="Button" />
              <ButtonNew
                variant="primary"
                size="small"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="primary"
                size="small"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="primary"
                size="small"
                label="Button"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Neutral Variant */}
        <section className="space-y-Space-600">
          <h2 className="text-heading">Neutral Variant</h2>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Medium Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="neutral" size="medium" label="Button" />
              <ButtonNew
                variant="neutral"
                size="medium"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="neutral"
                size="medium"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="neutral"
                size="medium"
                label="Button"
                disabled
              />
            </div>
          </div>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Small Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="neutral" size="small" label="Button" />
              <ButtonNew
                variant="neutral"
                size="small"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="neutral"
                size="small"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="neutral"
                size="small"
                label="Button"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Subtle Variant */}
        <section className="space-y-Space-600">
          <h2 className="text-heading">Subtle Variant</h2>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Medium Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="subtle" size="medium" label="Button" />
              <ButtonNew
                variant="subtle"
                size="medium"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="subtle"
                size="medium"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="subtle"
                size="medium"
                label="Button"
                disabled
              />
            </div>
          </div>

          <div className="space-y-Space-400">
            <h3 className="text-body-strong">Small Size</h3>
            <div className="flex flex-wrap gap-Space-400">
              <ButtonNew variant="subtle" size="small" label="Button" />
              <ButtonNew
                variant="subtle"
                size="small"
                label="Button"
                hasIconStart
              />
              <ButtonNew
                variant="subtle"
                size="small"
                label="Button"
                hasIconEnd
              />
              <ButtonNew
                variant="subtle"
                size="small"
                label="Button"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Figma対応表 */}
        <section className="space-y-Space-400">
          <h2 className="text-heading">Figma REST APIとの対応</h2>
          <div className="rounded-lg border border-border bg-background-secondary p-Space-600">
            <h3 className="text-body-strong mb-Space-400">
              ComponentPropertyDefinitionsから取得したプロパティ
            </h3>
            <ul className="space-y-Space-200 text-body-small">
              <li>
                <strong>Variant (VARIANT):</strong> Primary | Neutral | Subtle
                (default: Primary)
              </li>
              <li>
                <strong>State (VARIANT):</strong> Default | Hover | Disabled
                (default: Default)
              </li>
              <li>
                <strong>Size (VARIANT):</strong> Medium | Small (default:
                Medium)
              </li>
              <li>
                <strong>Label (TEXT):</strong> string (default: "Button")
              </li>
              <li>
                <strong>Has Icon Start (BOOLEAN):</strong> boolean (default:
                false)
              </li>
              <li>
                <strong>Has Icon End (BOOLEAN):</strong> boolean (default:
                false)
              </li>
              <li>
                <strong>Icon Start (INSTANCE_SWAP):</strong> Figma component
                reference
              </li>
              <li>
                <strong>Icon End (INSTANCE_SWAP):</strong> Figma component
                reference
              </li>
            </ul>

            <h3 className="text-body-strong mt-Space-600 mb-Space-400">
              APIから自動検出したFigma Styles
            </h3>
            <div className="space-y-Space-300">
              <div>
                <h4 className="text-body-small-strong mb-Space-200">
                  Text Style (depth=2 で子ノードから検出)
                </h4>
                <ul className="space-y-Space-150 text-body-small ml-Space-400">
                  <li>
                    <strong>Single Line/Body Base</strong> (Node ID: 56:9001)
                    <br />→{" "}
                    <code className="text-body-code bg-background px-Space-150">
                      .text-single-line-body-base
                    </code>{" "}
                    (16px, 400, line-height: 16px)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-body-small-strong mb-Space-200">
                  Variables (boundVariables.color.id から検出)
                </h4>
                <ul className="space-y-Space-150 text-body-small ml-Space-400">
                  <li>
                    <strong>Primary:</strong>
                    <br />
                    Fill: VariableID:3919:36428 / Stroke: VariableID:3919:36516
                  </li>
                  <li>
                    <strong>Neutral:</strong>
                    <br />
                    Fill: VariableID:106:12469 / Stroke: VariableID:106:12486
                  </li>
                  <li>
                    <strong>Subtle:</strong>
                    <br />
                    Fill: VariableID:3919:36448 / Stroke: VariableID:3919:36532
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-body-small-strong mb-Space-200">
                  Spacing Variables
                </h4>
                <ul className="space-y-Space-150 text-body-small ml-Space-400">
                  <li>Space-150, Space-200, Space-300, Space-400</li>
                </ul>
              </div>
            </div>

            <h3 className="text-body-strong mt-Space-600 mb-Space-400">
              完全自動化の仕組み
            </h3>
            <div className="space-y-Space-200 text-body-small text-foreground-secondary">
              <p>
                <strong>1. /files/&#123;key&#125;</strong> -
                ファイル全体を取得し、COMPONENT_SET型ノードを再帰探索
                (357個検出)
              </p>
              <p>
                <strong>2. componentPropertyDefinitions</strong> -
                各COMPONENT_SETからプロパティ定義を抽出
                (VARIANT/TEXT/BOOLEAN/INSTANCE_SWAP)
              </p>
              <p>
                <strong>3. /files/&#123;key&#125;/nodes?depth=2</strong> -
                子ノードも含めて取得し、Text Style/Fill/Stroke/Effect情報を抽出
              </p>
              <p>
                <strong>4. Style参照解決</strong> -
                子ノードのstyles.textからFigma Style ID (56:9001) を検出
              </p>
              <p>
                <strong>5. Variable参照解決</strong> -
                fills/strokesのboundVariables.color.idからVariable IDを検出
              </p>
              <p>
                <strong>6. コード生成</strong> - VARIANT型からCVA
                variants、TEXT/BOOLEAN型からprops、Style
                IDからCSSクラスを自動生成
              </p>
              <p className="mt-Space-300 text-body-small-strong">
                → プロパティ定義、使用Style、使用Variable、全てFigma REST
                APIから完全自動取得
              </p>
              <p className="text-body-small-strong">
                → 手動での型定義・Style指定は一切不要
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
