import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ButtonDanger } from "./ButtonDanger";

const meta = {
  title: "Components/ButtonDanger",
  component: ButtonDanger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "subtle"],
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
} satisfies Meta<typeof ButtonDanger>;

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
          <ButtonDanger variant="primary">Primary</ButtonDanger>
          <ButtonDanger variant="primary" disabled>
            Primary Disabled
          </ButtonDanger>
        </div>
        <div className="flex gap-3">
          <ButtonDanger variant="subtle">Subtle</ButtonDanger>
          <ButtonDanger variant="subtle" disabled>
            Subtle Disabled
          </ButtonDanger>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Small Size</h3>
        <div className="flex gap-3">
          <ButtonDanger variant="primary" size="small">
            Primary
          </ButtonDanger>
          <ButtonDanger variant="primary" size="small" disabled>
            Primary Disabled
          </ButtonDanger>
        </div>
        <div className="flex gap-3">
          <ButtonDanger variant="subtle" size="small">
            Subtle
          </ButtonDanger>
          <ButtonDanger variant="subtle" size="small" disabled>
            Subtle Disabled
          </ButtonDanger>
        </div>
      </div>
    </div>
  ),
};
