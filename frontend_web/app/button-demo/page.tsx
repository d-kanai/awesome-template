"use client";

import { Button as ButtonNew } from "@/features/shared/figma_generated/Button";
import { IconButton as IconButtonGenerated } from "@/features/shared/figma_generated/IconButton";

// Simple icon components for INSTANCE_SWAP demo
const StarIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M8 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
	</svg>
);

const ArrowRightIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M4 8h8m0 0L8 4m4 4l-4 4" />
	</svg>
);

const CheckIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M3 8l3 3 7-7" />
	</svg>
);

const SearchIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<circle cx="7" cy="7" r="5" />
		<path d="M14 14l-3-3" />
	</svg>
);

const CloseIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		aria-label="Close"
	>
		<path d="M3 3l10 10M13 3L3 13" />
	</svg>
);

const MenuIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		aria-label="Menu"
	>
		<path d="M2 4h12M2 8h12M2 12h12" />
	</svg>
);

export default function ButtonDemoPage() {
	return (
		<div className="min-h-screen bg-background p-Space-800">
			<div className="mx-auto max-w-6xl space-y-Space-800">
				<div>
					<h1 className="text-title-page">Figma Button Demo</h1>
					<p className="text-body-base text-foreground-secondary mt-Space-400">
						Figma REST APIから取得したComponentPropertyDefinitionsを完全再現
					</p>
					<div className="mt-Space-400 p-Space-400 bg-success/10 border border-success rounded-lg space-y-Space-200">
						<div className="text-body-strong text-success">
							✅ 完全自動化達成: COMPONENT_SET自動検出
						</div>
						<div className="text-body-small text-foreground-secondary">
							• Button: 30 variants (Label + Icon Start/End + Has Icon Start/End
							+ Variant + State + Size)
						</div>
						<div className="text-body-small text-foreground-secondary">
							• Icon Button: 18 variants (Icon + Variant + State + Size) -
							プロパティ署名から自動検出
						</div>
						<div className="text-body-small text-foreground-tertiary mt-Space-200">
							同じ「Buttons」ページ内の異なるCOMPONENT_SETを、componentSetPropertiesのキーで自動区別
						</div>
					</div>
					<div className="mt-Space-200 text-body-small text-foreground-tertiary">
						API取得プロパティ: Variant, State, Size (VARIANT) + Label (TEXT) +
						Has Icon Start/End (BOOLEAN) + Icon Start/End (INSTANCE_SWAP)
					</div>
				</div>

				{/* Icon Button Demo - API Generated */}
				<section className="space-y-Space-600 border-2 border-success p-Space-600 rounded-lg">
					<h2 className="text-heading">Icon Button (Figma API生成)</h2>
					<p className="text-body-small text-foreground-secondary">
						アイコンのみを表示する正方形ボタン - Figma REST APIから完全自動生成
					</p>
					<p className="text-body-small text-success">
						✅ Icon#4:192 (INSTANCE_SWAP) + Variant + State + Size
						の4プロパティから自動検出
					</p>

					{/* Matrix Layout: Size (横) × Variant (縦) × State (横) */}
					<div className="space-y-Space-600">
						{/* Size Labels */}
						<div className="flex gap-Space-600">
							<div className="w-24" />
							<div className="flex-1 grid grid-cols-2 gap-Space-600">
								<div className="text-center">
									<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
										Medium
									</div>
								</div>
								<div className="text-center">
									<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
										Small
									</div>
								</div>
							</div>
						</div>

						{/* Primary Row */}
						<div className="flex gap-Space-600 items-center">
							<div className="w-24">
								<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
									Primary
								</div>
							</div>
							<div className="flex-1 grid grid-cols-2 gap-Space-600">
								{/* Medium Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="primary"
										size="medium"
										state="default"
										icon={<StarIcon />}
										aria-label="Primary Medium Default"
									/>
									<IconButtonGenerated
										variant="primary"
										size="medium"
										state="hover"
										icon={<StarIcon />}
										aria-label="Primary Medium Hover"
									/>
									<IconButtonGenerated
										variant="primary"
										size="medium"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Primary Medium Disabled"
									/>
								</div>
								{/* Small Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="primary"
										size="small"
										state="default"
										icon={<StarIcon />}
										aria-label="Primary Small Default"
									/>
									<IconButtonGenerated
										variant="primary"
										size="small"
										state="hover"
										icon={<StarIcon />}
										aria-label="Primary Small Hover"
									/>
									<IconButtonGenerated
										variant="primary"
										size="small"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Primary Small Disabled"
									/>
								</div>
							</div>
						</div>

						{/* Neutral Row */}
						<div className="flex gap-Space-600 items-center">
							<div className="w-24">
								<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
									Neutral
								</div>
							</div>
							<div className="flex-1 grid grid-cols-2 gap-Space-600">
								{/* Medium Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="neutral"
										size="medium"
										state="default"
										icon={<StarIcon />}
										aria-label="Neutral Medium Default"
									/>
									<IconButtonGenerated
										variant="neutral"
										size="medium"
										state="hover"
										icon={<StarIcon />}
										aria-label="Neutral Medium Hover"
									/>
									<IconButtonGenerated
										variant="neutral"
										size="medium"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Neutral Medium Disabled"
									/>
								</div>
								{/* Small Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="neutral"
										size="small"
										state="default"
										icon={<StarIcon />}
										aria-label="Neutral Small Default"
									/>
									<IconButtonGenerated
										variant="neutral"
										size="small"
										state="hover"
										icon={<StarIcon />}
										aria-label="Neutral Small Hover"
									/>
									<IconButtonGenerated
										variant="neutral"
										size="small"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Neutral Small Disabled"
									/>
								</div>
							</div>
						</div>

						{/* Subtle Row */}
						<div className="flex gap-Space-600 items-center">
							<div className="w-24">
								<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
									Subtle
								</div>
							</div>
							<div className="flex-1 grid grid-cols-2 gap-Space-600">
								{/* Medium Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="subtle"
										size="medium"
										state="default"
										icon={<StarIcon />}
										aria-label="Subtle Medium Default"
									/>
									<IconButtonGenerated
										variant="subtle"
										size="medium"
										state="hover"
										icon={<StarIcon />}
										aria-label="Subtle Medium Hover"
									/>
									<IconButtonGenerated
										variant="subtle"
										size="medium"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Subtle Medium Disabled"
									/>
								</div>
								{/* Small Size */}
								<div className="flex gap-Space-400 items-center">
									<IconButtonGenerated
										variant="subtle"
										size="small"
										state="default"
										icon={<StarIcon />}
										aria-label="Subtle Small Default"
									/>
									<IconButtonGenerated
										variant="subtle"
										size="small"
										state="hover"
										icon={<StarIcon />}
										aria-label="Subtle Small Hover"
									/>
									<IconButtonGenerated
										variant="subtle"
										size="small"
										state="disabled"
										icon={<StarIcon />}
										aria-label="Subtle Small Disabled"
									/>
								</div>
							</div>
						</div>

						{/* State Labels */}
						<div className="flex gap-Space-600">
							<div className="w-24" />
							<div className="flex-1 grid grid-cols-2 gap-Space-600">
								<div className="flex gap-Space-400">
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Default
										</div>
									</div>
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Hover
										</div>
									</div>
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Disabled
										</div>
									</div>
								</div>
								<div className="flex gap-Space-400">
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Default
										</div>
									</div>
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Hover
										</div>
									</div>
									<div className="text-center flex-1">
										<div className="inline-block px-Space-300 py-Space-150 bg-background-secondary rounded-md text-body-small">
											Disabled
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* INSTANCE_SWAP Demo */}
				<section className="space-y-Space-600 border-2 border-primary p-Space-600 rounded-lg">
					<h2 className="text-heading">
						Button with INSTANCE_SWAP プロパティデモ
					</h2>
					<p className="text-body-small text-foreground-secondary">
						iconStart/iconEnd (INSTANCE_SWAP) に実際のReactコンポーネントを渡す
					</p>

					<div className="space-y-Space-400">
						<h3 className="text-body-strong">
							実際のアイコンコンポーネントを渡す
						</h3>
						<div className="flex flex-wrap gap-Space-400">
							<ButtonNew
								variant="primary"
								size="medium"
								label="Save"
								iconStart={<CheckIcon />}
							/>
							<ButtonNew
								variant="primary"
								size="medium"
								label="Next"
								iconEnd={<ArrowRightIcon />}
							/>
							<ButtonNew
								variant="subtle"
								size="medium"
								label="Favorite"
								iconStart={<StarIcon />}
							/>
							<ButtonNew
								variant="subtle"
								size="small"
								label="Continue"
								iconEnd={<ArrowRightIcon />}
							/>
						</div>
					</div>

					<div className="space-y-Space-400">
						<h3 className="text-body-strong">
							BOOLEANプロパティ（プレースホルダー）
						</h3>
						<div className="flex flex-wrap gap-Space-400">
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
						</div>
					</div>
				</section>

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
