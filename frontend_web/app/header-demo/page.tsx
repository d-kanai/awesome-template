"use client";

import { Header } from "@/features/shared/figma_generated/Header";

export default function HeaderDemoPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="space-y-Space-800">
				<section>
					<div className="p-Space-600">
						<h2 className="text-heading-large mb-Space-400">
							Header - Desktop
						</h2>
					</div>
					<Header platform="desktop" state="default" />
				</section>

				<section>
					<div className="p-Space-600">
						<h2 className="text-heading-large mb-Space-400">
							Header - Mobile (メニューボタン表示)
						</h2>
					</div>
					<div className="max-w-[375px] border border-border">
						<Header platform="mobile" state="default" />
					</div>
				</section>

				<section>
					<div className="p-Space-600">
						<h2 className="text-heading-large mb-Space-400">
							実際のページレイアウト例
						</h2>
					</div>
					<div className="min-h-screen bg-background-secondary">
						<Header platform="desktop" state="default" />

						{/* Hero Section */}
						<div className="container mx-auto px-Space-600 py-Space-1000">
							<div className="max-w-3xl">
								<h1 className="text-heading-xlarge mb-Space-600">
									Welcome to our platform
								</h1>
								<p className="text-body-large text-foreground-secondary mb-Space-800">
									This is a demo of the Header component generated from Figma
									using the REST API.
								</p>
								<div className="flex gap-Space-400">
									<button type="button" className="px-Space-600 py-Space-400 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
										Get Started
									</button>
									<button type="button" className="px-Space-600 py-Space-400 border border-border rounded-md hover:bg-accent transition-colors">
										Learn More
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
