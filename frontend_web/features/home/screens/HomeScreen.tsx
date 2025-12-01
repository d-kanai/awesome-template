"use client";

import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { HeroActionsButtonIds } from "@/features/home/ids";
import type { UserVoice } from "@/features/home/queries/getUserVoices";
import { CardGridTestimonials } from "@/shared/ui/components/CardGridTestimonials/CardGridTestimonials";
import { HeroActions } from "@/shared/ui/components/HeroActions/HeroActions";

interface HomeScreenProps {
  userVoices: UserVoice[];
  featureFlagShowVersionInfo: boolean; // サーバーサイドから渡されるフラグ
}

function HeroSection({
  onPrimaryClick,
  onSecondaryClick,
}: {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}) {
  return (
    <HeroActions
      title="Welcome to Our Platform"
      subtitle="Transform your workflow with our innovative solutions"
      primaryButtonId={HeroActionsButtonIds.primary}
      secondaryButtonId={HeroActionsButtonIds.secondary}
      primaryButtonText="Sign Up"
      secondaryButtonText="Contact Us"
      onPrimaryButtonClick={onPrimaryClick}
      onSecondaryButtonClick={onSecondaryClick}
    />
  );
}

function PlaceholderSection() {
  return (
    <div className="h-[400px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[var(--sds-color-slate-200,#e3e3e3)] inset-0" />
      </div>
    </div>
  );
}

function UserVoicesSection({ userVoices }: { userVoices: UserVoice[] }) {
  return (
    <CardGridTestimonials
      heading="What Our Users Say"
      subheading="Trusted by teams worldwide"
      hasSubheading={true}
      testimonials={userVoices}
    />
  );
}

export function HomeScreen({
  userVoices,
  featureFlagShowVersionInfo,
}: HomeScreenProps) {
  const router = useRouter();

  const handlePrimaryClick = () => {
    router.push(AUTH_ROUTES.SIGNUP);
  };

  const handleSecondaryClick = () => {
    router.push("/contact");
  };

  return (
    <>
      <HeroSection
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />
      <PlaceholderSection />
      <UserVoicesSection userVoices={userVoices} />

      {/* Feature Flag サンプル: サーバーサイドで評価済み */}
      {featureFlagShowVersionInfo && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Version: 1.0.0 (Feature Flag enabled)
        </div>
      )}
    </>
  );
}
