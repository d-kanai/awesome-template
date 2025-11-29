import type { Meta, StoryObj } from "@storybook/react";
import { TextLinkListItem } from "./TextLinkListItem";

const meta = {
  title: "Components/TextLinkListItem",
  component: TextLinkListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Link text",
    },
  },
} satisfies Meta<typeof TextLinkListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "List item",
  },
};

export const ShortText: Story = {
  args: {
    text: "About",
  },
};

export const LongText: Story = {
  args: {
    text: "Very long link text that might wrap",
  },
};

export const WithClickHandler: Story = {
  args: {
    text: "Click me",
    onClick: () => alert("Link clicked!"),
  },
};

export const MultipleItems: Story = {
  args: {
    text: "List item",
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLinkListItem text="UI design" />
      <TextLinkListItem text="UX design" />
      <TextLinkListItem text="Wireframing" />
      <TextLinkListItem text="Diagramming" />
      <TextLinkListItem text="Brainstorming" />
    </div>
  ),
};

export const WithDifferentLengths: Story = {
  args: {
    text: "List item",
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLinkListItem text="Blog" />
      <TextLinkListItem text="Best practices" />
      <TextLinkListItem text="Resource library" />
      <TextLinkListItem text="A" />
      <TextLinkListItem text="Development features and tools" />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    text: "List item",
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <TextLinkListItem
        text="About"
        onClick={() => console.log("About clicked")}
      />
      <TextLinkListItem
        text="Contact"
        onClick={() => console.log("Contact clicked")}
      />
      <TextLinkListItem
        text="Privacy"
        onClick={() => console.log("Privacy clicked")}
      />
      <TextLinkListItem
        text="Terms"
        onClick={() => console.log("Terms clicked")}
      />
    </div>
  ),
};
