import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavigationPill } from "./NavigationPill";

const meta = {
  title: "Components/NavigationPill",
  component: NavigationPill,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Navigation pill label",
    },
    state: {
      control: "select",
      options: ["Default", "Active", "Hover"],
      description: "Navigation pill state",
    },
    onClick: {
      action: "clicked",
    },
  },
} satisfies Meta<typeof NavigationPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Link",
    state: "Default",
  },
};

export const Active: Story = {
  args: {
    label: "Products",
    state: "Active",
  },
};

export const Hover: Story = {
  args: {
    label: "Solutions",
    state: "Hover",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <NavigationPill label="Default" state="Default" />
      <NavigationPill label="Active" state="Active" />
      <NavigationPill label="Hover" state="Hover" />
    </div>
  ),
};

export const NavigationList: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <NavigationPill label="Products" state="Active" />
      <NavigationPill label="Solutions" state="Default" />
      <NavigationPill label="Community" state="Default" />
      <NavigationPill label="Resources" state="Default" />
      <NavigationPill label="Pricing" state="Default" />
      <NavigationPill label="Contact" state="Default" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const items = ["Products", "Solutions", "Community", "Resources", "Pricing"];

    return (
      <div className="flex gap-2 items-center">
        {items.map((item, index) => (
          <NavigationPill
            key={item}
            label={item}
            state={activeIndex === index ? "Active" : "Default"}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    );
  },
};
