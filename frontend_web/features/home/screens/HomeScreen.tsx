"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/routes";
import type { UserVoice } from "@/features/home/queries/getUserVoices";
import { CardGridTestimonials } from "@/features/shared/ui/components/CardGridTestimonials/CardGridTestimonials";
import { Footer } from "@/features/shared/ui/components/Footer/Footer";
import { Header } from "@/features/shared/ui/components/Header/Header";
import { HeroActions } from "@/features/shared/ui/components/HeroActions/HeroActions";

interface HomeScreenProps {
  userVoices: UserVoice[];
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-full">
      {children}
    </div>
  );
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

export function HomeScreen({ userVoices }: HomeScreenProps) {
  const router = useRouter();

  const handlePrimaryClick = () => {
    router.push(AUTH_ROUTES.SIGNUP);
  };

  const handleSecondaryClick = () => {
    router.push("/contact");
  };

  const socialLinks = [
    {
      icon: (
        <Image
          src="/images/icons/social/x-logo.svg"
          alt="X (Twitter)"
          width={24}
          height={24}
        />
      ),
      href: "#",
      label: "X (Twitter)",
    },
    {
      icon: (
        <Image
          src="/images/icons/social/instagram-logo.svg"
          alt="Instagram"
          width={24}
          height={24}
        />
      ),
      href: "#",
      label: "Instagram",
    },
    {
      icon: (
        <Image
          src="/images/icons/social/youtube-logo.svg"
          alt="YouTube"
          width={24}
          height={24}
        />
      ),
      href: "#",
      label: "YouTube",
    },
    {
      icon: (
        <Image
          src="/images/icons/social/linkedin-logo.svg"
          alt="LinkedIn"
          width={24}
          height={24}
        />
      ),
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <ScreenContainer>
      <Header
        logoSrc="/images/logos/figma-logo.svg"
        logoAlt="Figma Logo"
        navigationItems={[
          { label: "Products", isActive: true },
          { label: "Solutions" },
          { label: "Community" },
          { label: "Resources" },
          { label: "Pricing" },
          { label: "Contact" },
        ]}
      />
      <HeroSection
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />
      <PlaceholderSection />
      <UserVoicesSection userVoices={userVoices} />
      <Footer socialLinks={socialLinks} />
    </ScreenContainer>
  );
}
