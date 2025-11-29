"use client";

import Image from "next/image";
import { Footer } from "@/shared/ui/components/Footer/Footer";
import { Header } from "@/shared/ui/components/Header/Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="bg-[var(--sds-color-background-default-default,#ffffff)] content-stretch flex flex-col items-start w-full min-h-screen">
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
      <main className="flex-1 w-full">{children}</main>
      <Footer socialLinks={socialLinks} />
    </div>
  );
}
