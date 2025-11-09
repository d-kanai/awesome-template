import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    platform: {
      control: "select",
      options: ["Desktop", "Mobile"],
      description: "Platform variant",
    },
    logoSrc: {
      control: "text",
      description: "Logo image URL",
    },
    logoAlt: {
      control: "text",
      description: "Logo alt text",
    },
    onSignIn: {
      action: "sign in clicked",
    },
    onRegister: {
      action: "register clicked",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    platform: "Desktop",
  },
};

export const DesktopWithLogo: Story = {
  args: {
    platform: "Desktop",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    logoAlt: "Figma",
  },
};

export const Mobile: Story = {
  args: {
    platform: "Mobile",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const MobileWithLogo: Story = {
  args: {
    platform: "Mobile",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    logoAlt: "Figma",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const CustomNavigation: Story = {
  args: {
    platform: "Desktop",
    navigationItems: [
      { label: "Home", isActive: true },
      { label: "About" },
      { label: "Services" },
      { label: "Blog" },
      { label: "Contact" },
    ],
  },
};

export const InteractiveDesktop: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const items = [
      "Products",
      "Solutions",
      "Community",
      "Resources",
      "Pricing",
      "Contact",
    ].map((label, index) => ({
      label,
      isActive: index === activeIndex,
      onClick: () => setActiveIndex(index),
    }));

    return (
      <Header
        platform="Desktop"
        navigationItems={items}
        onSignIn={() => alert("Sign in clicked")}
        onRegister={() => alert("Register clicked")}
      />
    );
  },
};

export const InteractiveMobile: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const items = [
      "Products",
      "Solutions",
      "Community",
      "Resources",
      "Pricing",
      "Contact",
    ].map((label, index) => ({
      label,
      isActive: index === activeIndex,
      onClick: () => setActiveIndex(index),
    }));

    return (
      <Header
        platform="Mobile"
        navigationItems={items}
        onSignIn={() => alert("Sign in clicked")}
        onRegister={() => alert("Register clicked")}
      />
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
