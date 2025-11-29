import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tag } from "./Tag";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Tag label text",
    },
    scheme: {
      control: "select",
      options: ["brand", "neutral", "positive", "danger", "warning"],
      description: "Color scheme of the tag",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Tag variant",
    },
    removable: {
      control: "boolean",
      description: "Show remove button",
    },
    onRemove: {
      action: "removed",
      description: "Callback when remove button is clicked",
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BrandPrimary: Story = {
  args: {
    label: "Tag",
    scheme: "brand",
    variant: "primary",
    removable: true,
  },
};

export const BrandSecondary: Story = {
  args: {
    label: "Tag",
    scheme: "brand",
    variant: "secondary",
    removable: true,
  },
};

export const DangerPrimary: Story = {
  args: {
    label: "Tag",
    scheme: "danger",
    variant: "primary",
    removable: true,
  },
};

export const DangerSecondary: Story = {
  args: {
    label: "Tag",
    scheme: "danger",
    variant: "secondary",
    removable: true,
  },
};

export const PositivePrimary: Story = {
  args: {
    label: "Tag",
    scheme: "positive",
    variant: "primary",
    removable: true,
  },
};

export const PositiveSecondary: Story = {
  args: {
    label: "Tag",
    scheme: "positive",
    variant: "secondary",
    removable: true,
  },
};

export const WarningPrimary: Story = {
  args: {
    label: "Tag",
    scheme: "warning",
    variant: "primary",
    removable: true,
  },
};

export const WarningSecondary: Story = {
  args: {
    label: "Tag",
    scheme: "warning",
    variant: "secondary",
    removable: true,
  },
};

export const NeutralPrimary: Story = {
  args: {
    label: "Tag",
    scheme: "neutral",
    variant: "primary",
    removable: true,
  },
};

export const NeutralSecondary: Story = {
  args: {
    label: "Tag",
    scheme: "neutral",
    variant: "secondary",
    removable: true,
  },
};

export const NotRemovable: Story = {
  args: {
    label: "Tag",
    scheme: "brand",
    variant: "primary",
    removable: false,
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Custom Tag Label",
    scheme: "positive",
    variant: "primary",
    removable: true,
  },
};

export const AllSchemes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag label="Brand Primary" scheme="brand" variant="primary" removable />
      <Tag
        label="Brand Secondary"
        scheme="brand"
        variant="secondary"
        removable
      />
      <Tag label="Danger Primary" scheme="danger" variant="primary" removable />
      <Tag
        label="Danger Secondary"
        scheme="danger"
        variant="secondary"
        removable
      />
      <Tag
        label="Positive Primary"
        scheme="positive"
        variant="primary"
        removable
      />
      <Tag
        label="Positive Secondary"
        scheme="positive"
        variant="secondary"
        removable
      />
      <Tag
        label="Warning Primary"
        scheme="warning"
        variant="primary"
        removable
      />
      <Tag
        label="Warning Secondary"
        scheme="warning"
        variant="secondary"
        removable
      />
      <Tag
        label="Neutral Primary"
        scheme="neutral"
        variant="primary"
        removable
      />
      <Tag
        label="Neutral Secondary"
        scheme="neutral"
        variant="secondary"
        removable
      />
    </div>
  ),
};
