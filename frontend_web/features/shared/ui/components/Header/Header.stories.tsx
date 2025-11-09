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
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "responsive", // 1200px
    },
  },
};

export const DesktopWithLogo: Story = {
  args: {
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    logoAlt: "Figma",
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1", // 375px
    },
  },
};

export const MobileWithLogo: Story = {
  args: {
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
    navigationItems: [
      { label: "Home", isActive: true },
      { label: "About" },
      { label: "Services" },
      { label: "Blog" },
      { label: "Contact" },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
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
        navigationItems={items}
        onSignIn={() => alert("Sign in clicked")}
        onRegister={() => alert("Register clicked")}
      />
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
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
