import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavigationPillList } from "./NavigationPillList";

const meta = {
  title: "Components/NavigationPillList",
  component: NavigationPillList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["Row", "Column"],
      description: "Layout direction",
    },
  },
} satisfies Meta<typeof NavigationPillList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: {
    direction: "Row",
  },
};

export const Column: Story = {
  args: {
    direction: "Column",
  },
};

export const CustomItems: Story = {
  args: {
    direction: "Row",
    items: [
      { label: "Home", state: "Active" },
      { label: "About" },
      { label: "Services" },
      { label: "Blog" },
      { label: "Contact" },
    ],
  },
};

export const MinimalItems: Story = {
  args: {
    direction: "Row",
    items: [
      { label: "Products", state: "Active" },
      { label: "Pricing" },
      { label: "Contact" },
    ],
  },
};

export const ColumnLayout: Story = {
  args: {
    direction: "Column",
    items: [
      { label: "Products", state: "Active" },
      { label: "Solutions" },
      { label: "Community" },
      { label: "Resources" },
      { label: "Pricing" },
      { label: "Contact" },
    ],
  },
};

export const Interactive: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const labels = ["Products", "Solutions", "Community", "Resources", "Pricing", "Contact"];

    const items = labels.map((label, index) => ({
      label,
      state: activeIndex === index ? ("Active" as const) : ("Default" as const),
      onClick: () => setActiveIndex(index),
    }));

    return <NavigationPillList items={items} direction="Row" />;
  },
};

export const InteractiveColumn: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState(1);
    const labels = ["Products", "Solutions", "Community", "Resources", "Pricing", "Contact"];

    const items = labels.map((label, index) => ({
      label,
      state: activeIndex === index ? ("Active" as const) : ("Default" as const),
      onClick: () => setActiveIndex(index),
    }));

    return <NavigationPillList items={items} direction="Column" />;
  },
};

export const Comparison: Story = {
  render: () => {
    const items = [
      { label: "Products", state: "Active" as const },
      { label: "Solutions" },
      { label: "Community" },
      { label: "Resources" },
    ];

    return (
      <div className="flex gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Row Direction</h3>
          <NavigationPillList items={items} direction="Row" />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Column Direction</h3>
          <NavigationPillList items={items} direction="Column" />
        </div>
      </div>
    );
  },
};
