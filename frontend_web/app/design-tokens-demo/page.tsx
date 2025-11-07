export default function DesignTokensDemoPage() {
	return (
		<div className="min-h-screen p-Space-800">
			<div className="max-w-4xl mx-auto space-y-Space-600">
				{/* Header */}
				<header className="space-y-Space-400">
					<h1 className="text-[48px] font-[700] text-sds_light-Text-Brand-Default">
						Figma Design Tokens Demo
					</h1>
					<p className="text-[16px] text-sds_light-Text-Default-Secondary">
						Figmaから取り込んだデザイントークンを実際に使用したデモページ
					</p>
				</header>

				{/* 使い方の説明 */}
				<section className="bg-sds_light-Background-Brand-Tertiary p-Space-600 rounded">
					<h2 className="text-[24px] font-[600] mb-Space-400 text-sds_light-Text-Brand-Default">
						🎨 使い方の比較
					</h2>
					<div className="space-y-Space-300 text-[14px]">
						<div>
							<div className="font-[600] mb-Space-200">❌ Before（統合前）</div>
							<code className="block bg-white p-Space-300 rounded">
								{`<div className="bg-[#2c2c2c] text-[#ffffff]" />`}
							</code>
						</div>
						<div>
							<div className="font-[600] mb-Space-200">
								✅ After（統合後）- Figmaトークン名
							</div>
							<code className="block bg-white p-Space-300 rounded">
								{`<div className="bg-sds_light-Background-Brand-Default text-white" />`}
							</code>
						</div>
						<div>
							<div className="font-[600] mb-Space-200">
								✅ After（統合後）- Spacing
							</div>
							<code className="block bg-white p-Space-300 rounded">
								{`<div className="p-Space-400 m-Space-800" />`}
							</code>
						</div>
					</div>
				</section>

				{/* Color Palette */}
				<section className="space-y-Space-400">
					<h2 className="text-[32px] font-[600] text-[#2c2c2c]">
						Color Palette
					</h2>

					<div className="space-y-Space-400">
						{/* Brand Colors */}
						<div>
							<h3 className="text-[20px] font-[600] mb-Space-300">Brand</h3>
							<div className="grid grid-cols-4 gap-Space-300">
								<ColorSwatch
									color="bg-[#2c2c2c]"
									name="Brand Default"
									value="#2c2c2c"
								/>
								<ColorSwatch
									color="bg-[#1e1e1e]"
									name="Brand Hover"
									value="#1e1e1e"
								/>
								<ColorSwatch
									color="bg-[#e6e6e6]"
									name="Brand Secondary"
									value="#e6e6e6"
								/>
								<ColorSwatch
									color="bg-[#f5f5f5]"
									name="Brand Tertiary"
									value="#f5f5f5"
								/>
							</div>
						</div>

						{/* Status Colors */}
						<div>
							<h3 className="text-[20px] font-[600] mb-Space-300">Status</h3>
							<div className="grid grid-cols-3 gap-Space-300">
								<ColorSwatch
									color="bg-[#14ae5c]"
									name="Positive"
									value="#14ae5c"
								/>
								<ColorSwatch
									color="bg-[#e8b931]"
									name="Warning"
									value="#e8b931"
								/>
								<ColorSwatch
									color="bg-[#ec221f]"
									name="Danger"
									value="#ec221f"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Spacing */}
				<section className="space-y-Space-400">
					<h2 className="text-[32px] font-[600] text-[#2c2c2c]">Spacing</h2>
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
					<h2 className="text-[32px] font-[600] text-[#2c2c2c]">Typography</h2>
					<div className="space-y-Space-400">
						<div>
							<p className="text-[72px] font-[700]">Title Hero (72px/700)</p>
						</div>
						<div>
							<p className="text-[48px] font-[700]">Title Page (48px/700)</p>
						</div>
						<div>
							<p className="text-[32px] font-[400]">Subtitle (32px/400)</p>
						</div>
						<div>
							<p className="text-[24px] font-[600]">Heading (24px/600)</p>
						</div>
						<div>
							<p className="text-[16px] font-[400]">Body (16px/400)</p>
						</div>
					</div>
				</section>

				{/* Button Examples */}
				<section className="space-y-Space-400">
					<h2 className="text-[32px] font-[600] text-sds_light-Text-Brand-Default">
						Buttons（Figmaトークン名使用）
					</h2>
					<div className="flex gap-Space-400">
						<button
							type="button"
							className="px-Space-600 py-Space-300 bg-sds_light-Background-Brand-Default text-white rounded hover:bg-sds_light-Background-Brand-Hover transition-colors"
						>
							Primary Button
						</button>
						<button
							type="button"
							className="px-Space-600 py-Space-300 bg-sds_light-Background-Positive-Default text-white rounded hover:bg-sds_light-Background-Positive-Hover transition-colors"
						>
							Success Button
						</button>
						<button
							type="button"
							className="px-Space-600 py-Space-300 bg-sds_light-Background-Danger-Default text-white rounded hover:bg-sds_light-Background-Danger-Hover transition-colors"
						>
							Danger Button
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}

function ColorSwatch({
	color,
	name,
	value,
}: { color: string; name: string; value: string }) {
	return (
		<div className="space-y-Space-200">
			<div className={`${color} h-24 rounded border border-gray-200`} />
			<div className="text-[14px]">
				<div className="font-[600]">{name}</div>
				<div className="text-[#757575]">{value}</div>
			</div>
		</div>
	);
}

function SpacingDemo({ size, label }: { size: string; label: string }) {
	return (
		<div className="flex items-center gap-Space-400">
			<div className="w-32 text-[14px] font-[600]">{label}</div>
			<div className="bg-[#14ae5c] h-8" style={{ width: size }} />
			<div className="text-[14px] text-[#757575]">{size}</div>
		</div>
	);
}
