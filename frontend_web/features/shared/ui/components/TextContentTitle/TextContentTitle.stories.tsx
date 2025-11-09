import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextContentTitle } from "./TextContentTitle";

const meta = {
  title: "Components/TextContentTitle",
  component: TextContentTitle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main title text",
    },
    subtitle: {
      control: "text",
      description: "Subtitle text",
    },
    hasSubtitle: {
      control: "boolean",
      description: "Show or hide subtitle",
    },
    align: {
      control: "select",
      options: ["Start", "Center"],
      description: "Text alignment",
    },
  },
} satisfies Meta<typeof TextContentTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {
  args: {
    align: "Start",
    title: "Title",
    subtitle: "Subtitle",
    hasSubtitle: true,
  },
};

export const Center: Story = {
  args: {
    align: "Center",
    title: "Title",
    subtitle: "Subtitle",
    hasSubtitle: true,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    align: "Start",
    title: "Title Only",
    hasSubtitle: false,
  },
};

export const LongContent: Story = {
  args: {
    align: "Start",
    title: "A Very Long Title That Spans Multiple Lines",
    subtitle: "This is a longer subtitle that provides additional context and information",
    hasSubtitle: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-12 items-start w-full">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Start Alignment</h3>
        <TextContentTitle
          align="Start"
          title="Welcome to Our Platform"
          subtitle="Build amazing experiences with our tools"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Center Alignment</h3>
        <TextContentTitle
          align="Center"
          title="Welcome to Our Platform"
          subtitle="Build amazing experiences with our tools"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Without Subtitle</h3>
        <TextContentTitle
          align="Start"
          title="Simple Title"
          hasSubtitle={false}
        />
      </div>
    </div>
  ),
};

export const HeroSection: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <TextContentTitle
        align="Center"
        title="Transform Your Workflow"
        subtitle="Powerful tools designed for modern teams"
      />
    </div>
  ),
};

export const LandingPage: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <TextContentTitle
        align="Start"
        title="Everything you need to succeed"
        subtitle="All-in-one platform for your business"
      />
    </div>
  ),
};

export const Comparison: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex-1 border border-gray-200 p-8 rounded-lg">
        <h3 className="text-sm font-semibold mb-4">Start Aligned</h3>
        <TextContentTitle
          align="Start"
          title="Get Started"
          subtitle="Begin your journey"
        />
      </div>
      <div className="flex-1 border border-gray-200 p-8 rounded-lg">
        <h3 className="text-sm font-semibold mb-4">Center Aligned</h3>
        <TextContentTitle
          align="Center"
          title="Get Started"
          subtitle="Begin your journey"
        />
      </div>
    </div>
  ),
};
