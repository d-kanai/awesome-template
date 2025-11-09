import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle"],
      description: "ボタンのバリアント",
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "ボタンのサイズ",
    },
    disabled: {
      control: "boolean",
      description: "無効状態",
    },
    children: {
      control: "text",
      description: "ボタンのラベル",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant stories
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
  },
};

export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Button",
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    disabled: true,
  },
};

// Neutral variant stories
export const Neutral: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    children: "Button",
  },
};

export const NeutralSmall: Story = {
  args: {
    variant: "neutral",
    size: "small",
    children: "Button",
  },
};

export const NeutralDisabled: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    children: "Button",
    disabled: true,
  },
};

// Subtle variant stories
export const Subtle: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    children: "Button",
  },
};

export const SubtleSmall: Story = {
  args: {
    variant: "subtle",
    size: "small",
    children: "Button",
  },
};

export const SubtleDisabled: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    children: "Button",
    disabled: true,
  },
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Medium Size</h3>
        <div className="flex gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" disabled>
            Primary Disabled
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="neutral">Neutral</Button>
          <Button variant="neutral" disabled>
            Neutral Disabled
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="subtle">Subtle</Button>
          <Button variant="subtle" disabled>
            Subtle Disabled
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Small Size</h3>
        <div className="flex gap-3">
          <Button variant="primary" size="small">
            Primary
          </Button>
          <Button variant="primary" size="small" disabled>
            Primary Disabled
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="neutral" size="small">
            Neutral
          </Button>
          <Button variant="neutral" size="small" disabled>
            Neutral Disabled
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="subtle" size="small">
            Subtle
          </Button>
          <Button variant="subtle" size="small" disabled>
            Subtle Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
};
