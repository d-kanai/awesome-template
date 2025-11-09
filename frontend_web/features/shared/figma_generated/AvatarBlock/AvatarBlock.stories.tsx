import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AvatarBlock } from "./AvatarBlock";

const meta = {
  title: "Components/AvatarBlock",
  component: AvatarBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Person's name or title",
    },
    description: {
      control: "text",
      description: "Person's role or additional info",
    },
    avatarSrc: {
      control: "text",
      description: "Avatar image URL",
    },
    avatarAlt: {
      control: "text",
      description: "Avatar alt text",
    },
    avatarSize: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Avatar size",
    },
    avatarShape: {
      control: "select",
      options: ["circle", "square"],
      description: "Avatar shape",
    },
  },
} satisfies Meta<typeof AvatarBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Sarah Johnson",
    description: "CEO, TechCorp",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
    avatarAlt: "Sarah Johnson",
    avatarSize: "large",
    avatarShape: "circle",
  },
};

export const SmallAvatar: Story = {
  args: {
    title: "Michael Chen",
    description: "Product Manager",
    avatarSrc: "https://i.pravatar.cc/150?img=2",
    avatarAlt: "Michael Chen",
    avatarSize: "small",
    avatarShape: "circle",
  },
};

export const MediumAvatar: Story = {
  args: {
    title: "Emma Wilson",
    description: "Designer",
    avatarSrc: "https://i.pravatar.cc/150?img=3",
    avatarAlt: "Emma Wilson",
    avatarSize: "medium",
    avatarShape: "circle",
  },
};

export const SquareAvatar: Story = {
  args: {
    title: "James Brown",
    description: "CTO, Enterprise Inc",
    avatarSrc: "https://i.pravatar.cc/150?img=4",
    avatarAlt: "James Brown",
    avatarSize: "large",
    avatarShape: "square",
  },
};

export const LongContent: Story = {
  args: {
    title: "Dr. Alexander Montgomery III",
    description: "Chief Technology Officer, Global Innovation Solutions",
    avatarSrc: "https://i.pravatar.cc/150?img=5",
    avatarAlt: "Dr. Alexander Montgomery III",
    avatarSize: "large",
    avatarShape: "circle",
  },
};

export const ShortContent: Story = {
  args: {
    title: "Sam",
    description: "Dev",
    avatarSrc: "https://i.pravatar.cc/150?img=6",
    avatarAlt: "Sam",
    avatarSize: "medium",
    avatarShape: "circle",
  },
};

export const AllVariants: Story = {
  args: {
    title: "Sample Title",
    description: "Sample Description",
  },
  render: () => (
    <div className="flex flex-col gap-8 items-start w-full max-w-md">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Large Circle</h3>
        <AvatarBlock
          title="Sarah Johnson"
          description="CEO, TechCorp"
          avatarSrc="https://i.pravatar.cc/150?img=1"
          avatarAlt="Sarah Johnson"
          avatarSize="large"
          avatarShape="circle"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Medium Circle</h3>
        <AvatarBlock
          title="Michael Chen"
          description="Product Manager"
          avatarSrc="https://i.pravatar.cc/150?img=2"
          avatarAlt="Michael Chen"
          avatarSize="medium"
          avatarShape="circle"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Small Circle</h3>
        <AvatarBlock
          title="Emma Wilson"
          description="Designer"
          avatarSrc="https://i.pravatar.cc/150?img=3"
          avatarAlt="Emma Wilson"
          avatarSize="small"
          avatarShape="circle"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Large Square</h3>
        <AvatarBlock
          title="James Brown"
          description="CTO"
          avatarSrc="https://i.pravatar.cc/150?img=4"
          avatarAlt="James Brown"
          avatarSize="large"
          avatarShape="square"
        />
      </div>
    </div>
  ),
};

export const MultipleUsers: Story = {
  args: {
    title: "Sample Title",
    description: "Sample Description",
  },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <AvatarBlock
        title="Sarah Johnson"
        description="CEO, TechCorp"
        avatarSrc="https://i.pravatar.cc/150?img=1"
        avatarAlt="Sarah Johnson"
      />
      <AvatarBlock
        title="Michael Chen"
        description="Product Manager, StartupXYZ"
        avatarSrc="https://i.pravatar.cc/150?img=2"
        avatarAlt="Michael Chen"
      />
      <AvatarBlock
        title="Emma Wilson"
        description="Designer, Creative Agency"
        avatarSrc="https://i.pravatar.cc/150?img=3"
        avatarAlt="Emma Wilson"
      />
      <AvatarBlock
        title="James Brown"
        description="CTO, Enterprise Inc"
        avatarSrc="https://i.pravatar.cc/150?img=4"
        avatarAlt="James Brown"
      />
    </div>
  ),
};
