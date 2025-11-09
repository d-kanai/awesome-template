import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

// Simple Info Icon component
const InfoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M16 16V22" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
  </svg>
);

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    assetType: {
      control: "select",
      options: ["icon", "image"],
      description: "アセットの種類",
    },
    variant: {
      control: "select",
      options: ["default", "stroke"],
      description: "カードのバリアント",
    },
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "レイアウト方向",
    },
    title: {
      control: "text",
      description: "タイトル",
    },
    description: {
      control: "text",
      description: "説明文",
    },
    buttonText: {
      control: "text",
      description: "ボタンテキスト",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultDescription =
  "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.";

// Icon variants
export const IconDefaultHorizontal: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "icon",
    variant: "default",
    direction: "horizontal",
    icon: <InfoIcon />,
  },
};

export const IconDefaultVertical: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "icon",
    variant: "default",
    direction: "vertical",
    icon: <InfoIcon />,
  },
};

export const IconStrokeHorizontal: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "icon",
    variant: "stroke",
    direction: "horizontal",
    icon: <InfoIcon />,
  },
};

export const IconStrokeVertical: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "icon",
    variant: "stroke",
    direction: "vertical",
    icon: <InfoIcon />,
  },
};

// Image variants
export const ImageDefaultHorizontal: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "image",
    variant: "default",
    direction: "horizontal",
    image: "https://via.placeholder.com/160",
    imageAlt: "Placeholder image",
  },
};

export const ImageDefaultVertical: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "image",
    variant: "default",
    direction: "vertical",
    image: "https://via.placeholder.com/160",
    imageAlt: "Placeholder image",
  },
};

export const ImageStrokeHorizontal: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "image",
    variant: "stroke",
    direction: "horizontal",
    image: "https://via.placeholder.com/160",
    imageAlt: "Placeholder image",
  },
};

export const ImageStrokeVertical: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "image",
    variant: "stroke",
    direction: "vertical",
    image: "https://via.placeholder.com/160",
    imageAlt: "Placeholder image",
  },
};

// Image placeholder (no image provided)
export const ImagePlaceholder: Story = {
  args: {
    title: "Title",
    description: defaultDescription,
    buttonText: "Button",
    assetType: "image",
    variant: "stroke",
    direction: "horizontal",
  },
};

// All variants comparison
export const AllVariants: Story = {
  args: {
    title: "Card Title",
    description: "Card description",
  },
  render: () => (
    <div className="flex flex-col gap-12 max-w-4xl">
      <div>
        <h2 className="text-heading mb-4">Icon - Default</h2>
        <div className="flex flex-col gap-6">
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="icon"
            variant="default"
            direction="horizontal"
            icon={<InfoIcon />}
          />
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="icon"
            variant="default"
            direction="vertical"
            icon={<InfoIcon />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-heading mb-4">Icon - Stroke</h2>
        <div className="flex flex-col gap-6">
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="icon"
            variant="stroke"
            direction="horizontal"
            icon={<InfoIcon />}
          />
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="icon"
            variant="stroke"
            direction="vertical"
            icon={<InfoIcon />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-heading mb-4">Image - Default</h2>
        <div className="flex flex-col gap-6">
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="image"
            variant="default"
            direction="horizontal"
          />
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="image"
            variant="default"
            direction="vertical"
          />
        </div>
      </div>

      <div>
        <h2 className="text-heading mb-4">Image - Stroke</h2>
        <div className="flex flex-col gap-6">
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="image"
            variant="stroke"
            direction="horizontal"
          />
          <Card
            title="Title"
            description={defaultDescription}
            buttonText="Button"
            assetType="image"
            variant="stroke"
            direction="vertical"
          />
        </div>
      </div>
    </div>
  ),
};
