import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FooterLinkSection } from "./FooterLinkSection";

const meta = {
  title: "Components/FooterLinkSection",
  component: FooterLinkSection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
    links: {
      control: "object",
      description: "Array of link items",
    },
  },
} satisfies Meta<typeof FooterLinkSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultLinks = [
  { label: "List item" },
  { label: "List item" },
  { label: "List item" },
  { label: "List item" },
  { label: "List item" },
  { label: "List item" },
  { label: "List item" },
];

export const Default: Story = {
  args: {
    title: "Text Strong",
    links: defaultLinks,
  },
};

export const UseCases: Story = {
  args: {
    title: "Use cases",
    links: [
      { label: "UI design" },
      { label: "UX design" },
      { label: "Wireframing" },
      { label: "Diagramming" },
      { label: "Brainstorming" },
      { label: "Online whiteboard" },
      { label: "Team collaboration" },
    ],
  },
};

export const Explore: Story = {
  args: {
    title: "Explore",
    links: [
      { label: "Design" },
      { label: "Prototyping" },
      { label: "Development features" },
      { label: "Design systems" },
      { label: "Collaboration features" },
      { label: "Design process" },
      { label: "FigJam" },
    ],
  },
};

export const Resources: Story = {
  args: {
    title: "Resources",
    links: [
      { label: "Blog" },
      { label: "Best practices" },
      { label: "Colors" },
      { label: "Color wheel" },
      { label: "Support" },
      { label: "Developers" },
      { label: "Resource library" },
    ],
  },
};

export const ShortList: Story = {
  args: {
    title: "Quick Links",
    links: [
      { label: "About" },
      { label: "Contact" },
      { label: "Privacy" },
    ],
  },
};

export const LongList: Story = {
  args: {
    title: "All Features",
    links: [
      { label: "Feature 1" },
      { label: "Feature 2" },
      { label: "Feature 3" },
      { label: "Feature 4" },
      { label: "Feature 5" },
      { label: "Feature 6" },
      { label: "Feature 7" },
      { label: "Feature 8" },
      { label: "Feature 9" },
      { label: "Feature 10" },
    ],
  },
};

export const WithClickHandlers: Story = {
  args: {
    title: "Interactive Links",
    links: [
      { label: "Click me", onClick: () => alert("Link 1 clicked") },
      { label: "Click me too", onClick: () => alert("Link 2 clicked") },
      { label: "And me", onClick: () => alert("Link 3 clicked") },
    ],
  },
};

export const MultipleSections: Story = {
  args: {
    title: "Sample Title",
    links: defaultLinks,
  },
  render: () => (
    <div className="flex gap-8">
      <FooterLinkSection
        title="Use cases"
        links={[
          { label: "UI design" },
          { label: "UX design" },
          { label: "Wireframing" },
          { label: "Diagramming" },
          { label: "Brainstorming" },
        ]}
      />
      <FooterLinkSection
        title="Explore"
        links={[
          { label: "Design" },
          { label: "Prototyping" },
          { label: "Development features" },
          { label: "Design systems" },
        ]}
      />
      <FooterLinkSection
        title="Resources"
        links={[
          { label: "Blog" },
          { label: "Best practices" },
          { label: "Support" },
          { label: "Developers" },
        ]}
      />
    </div>
  ),
};
