import type { Meta, StoryObj } from "@storybook/react";
import { HeroActions } from "./HeroActions";

const meta = {
  title: "Components/HeroActions",
  component: HeroActions,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Hero title",
    },
    subtitle: {
      control: "text",
      description: "Hero subtitle",
    },
    primaryButtonId: {
      control: "text",
      description: "Primary button ID for click event logging",
    },
    secondaryButtonId: {
      control: "text",
      description: "Secondary button ID for click event logging",
    },
    primaryButtonText: {
      control: "text",
      description: "Primary button text",
    },
    secondaryButtonText: {
      control: "text",
      description: "Secondary button text",
    },
    onPrimaryButtonClick: {
      action: "primary button clicked",
    },
    onSecondaryButtonClick: {
      action: "secondary button clicked",
    },
  },
} satisfies Meta<typeof HeroActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Title",
    subtitle: "Subtitle",
    primaryButtonId: "storybook-hero-primary-button",
    secondaryButtonId: "storybook-hero-secondary-button",
  },
};

export const ProductLaunch: Story = {
  args: {
    title: "Welcome to the Future",
    subtitle: "Experience innovation like never before",
    primaryButtonId: "storybook-hero-primary-button",
    secondaryButtonId: "storybook-hero-secondary-button",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More",
  },
};

export const ShortContent: Story = {
  args: {
    title: "Simple & Powerful",
    subtitle: "Built for teams",
    primaryButtonId: "storybook-hero-primary-button",
    secondaryButtonId: "storybook-hero-secondary-button",
    primaryButtonText: "Try Now",
    secondaryButtonText: "View Demo",
  },
};

export const LongContent: Story = {
  args: {
    title: "Transform Your Workflow with Advanced Collaboration Tools",
    subtitle:
      "Streamline your team's productivity and creativity with our comprehensive design platform",
    primaryButtonId: "storybook-hero-primary-button",
    secondaryButtonId: "storybook-hero-secondary-button",
    primaryButtonText: "Start Free Trial",
    secondaryButtonText: "Watch Video",
  },
};
