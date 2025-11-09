import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonWithIcons from "./ButtonWithIcons";
import StarIcon from "../../components/icons/StarIcon";
import XIcon from "../../components/icons/XIcon";

const meta = {
  title: "Figma Components/ButtonWithIcons",
  component: ButtonWithIcons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle"],
      description: "ボタンのバリアント（色スタイル）",
    },
    size: {
      control: "select",
      options: ["medium", "small"],
      description: "ボタンのサイズ",
    },
    disabled: {
      control: "boolean",
      description: "無効化状態",
    },
    children: {
      control: "text",
      description: "ボタンのテキスト",
    },
  },
} satisfies Meta<typeof ButtonWithIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Variants
export const PrimaryMedium: Story = {
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

export const PrimaryWithLeftIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    leftIcon: <StarIcon />,
  },
};

export const PrimaryWithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    rightIcon: <XIcon />,
  },
};

export const PrimaryWithBothIcons: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    leftIcon: <StarIcon />,
    rightIcon: <XIcon />,
  },
};

// Neutral Variants
export const NeutralMedium: Story = {
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

export const NeutralWithLeftIcon: Story = {
  args: {
    variant: "neutral",
    size: "medium",
    children: "Button",
    leftIcon: <StarIcon />,
  },
};

// Subtle Variants
export const SubtleMedium: Story = {
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

export const SubtleWithIcons: Story = {
  args: {
    variant: "subtle",
    size: "medium",
    children: "Button",
    leftIcon: <StarIcon />,
    rightIcon: <XIcon />,
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    disabled: true,
  },
};

export const DisabledWithIcons: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Button",
    leftIcon: <StarIcon />,
    rightIcon: <XIcon />,
    disabled: true,
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "medium",
    children: "Click me",
    onClick: () => alert("Button clicked!"),
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span className="w-20 text-sm">Primary:</span>
        <ButtonWithIcons variant="primary" size="medium">
          Medium
        </ButtonWithIcons>
        <ButtonWithIcons variant="primary" size="small">
          Small
        </ButtonWithIcons>
        <ButtonWithIcons variant="primary" size="medium" leftIcon={<StarIcon />}>
          Icon
        </ButtonWithIcons>
        <ButtonWithIcons variant="primary" size="medium" disabled>
          Disabled
        </ButtonWithIcons>
      </div>
      <div className="flex gap-4 items-center">
        <span className="w-20 text-sm">Neutral:</span>
        <ButtonWithIcons variant="neutral" size="medium">
          Medium
        </ButtonWithIcons>
        <ButtonWithIcons variant="neutral" size="small">
          Small
        </ButtonWithIcons>
        <ButtonWithIcons variant="neutral" size="medium" leftIcon={<StarIcon />}>
          Icon
        </ButtonWithIcons>
        <ButtonWithIcons variant="neutral" size="medium" disabled>
          Disabled
        </ButtonWithIcons>
      </div>
      <div className="flex gap-4 items-center">
        <span className="w-20 text-sm">Subtle:</span>
        <ButtonWithIcons variant="subtle" size="medium">
          Medium
        </ButtonWithIcons>
        <ButtonWithIcons variant="subtle" size="small">
          Small
        </ButtonWithIcons>
        <ButtonWithIcons variant="subtle" size="medium" leftIcon={<StarIcon />}>
          Icon
        </ButtonWithIcons>
        <ButtonWithIcons variant="subtle" size="medium" disabled>
          Disabled
        </ButtonWithIcons>
      </div>
    </div>
  ),
};
