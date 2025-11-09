import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["initial", "image"],
      description: "Avatar type: initials or image",
    },
    size: {
      control: "select",
      options: ["large", "medium", "small"],
      description: "Avatar size",
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
      description: "Avatar shape",
    },
    initials: {
      control: "text",
      description: "Initials to display (for type=initial)",
    },
    src: {
      control: "text",
      description: "Image source URL (for type=image)",
    },
    alt: {
      control: "text",
      description: "Alt text for image",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Image type stories
export const ImageLargeCircle: Story = {
  args: {
    type: "image",
    size: "large",
    shape: "circle",
    src: "https://i.pravatar.cc/150?img=1",
    alt: "User avatar",
  },
};

export const ImageMediumCircle: Story = {
  args: {
    type: "image",
    size: "medium",
    shape: "circle",
    src: "https://i.pravatar.cc/150?img=2",
    alt: "User avatar",
  },
};

export const ImageSmallCircle: Story = {
  args: {
    type: "image",
    size: "small",
    shape: "circle",
    src: "https://i.pravatar.cc/150?img=3",
    alt: "User avatar",
  },
};

export const ImageLargeSquare: Story = {
  args: {
    type: "image",
    size: "large",
    shape: "square",
    src: "https://i.pravatar.cc/150?img=4",
    alt: "User avatar",
  },
};

export const ImageMediumSquare: Story = {
  args: {
    type: "image",
    size: "medium",
    shape: "square",
    src: "https://i.pravatar.cc/150?img=5",
    alt: "User avatar",
  },
};

export const ImageSmallSquare: Story = {
  args: {
    type: "image",
    size: "small",
    shape: "square",
    src: "https://i.pravatar.cc/150?img=6",
    alt: "User avatar",
  },
};

// Initial type stories
export const InitialLargeCircle: Story = {
  args: {
    type: "initial",
    size: "large",
    shape: "circle",
    initials: "AB",
  },
};

export const InitialMediumCircle: Story = {
  args: {
    type: "initial",
    size: "medium",
    shape: "circle",
    initials: "CD",
  },
};

export const InitialSmallCircle: Story = {
  args: {
    type: "initial",
    size: "small",
    shape: "circle",
    initials: "EF",
  },
};

export const InitialLargeSquare: Story = {
  args: {
    type: "initial",
    size: "large",
    shape: "square",
    initials: "GH",
  },
};

export const InitialMediumSquare: Story = {
  args: {
    type: "initial",
    size: "medium",
    shape: "square",
    initials: "IJ",
  },
};

export const InitialSmallSquare: Story = {
  args: {
    type: "initial",
    size: "small",
    shape: "square",
    initials: "KL",
  },
};

// All variants comparison
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Image - Circle</h3>
        <div className="flex gap-4 items-center">
          <Avatar
            type="image"
            size="large"
            shape="circle"
            src="https://i.pravatar.cc/150?img=1"
            alt="Large"
          />
          <Avatar
            type="image"
            size="medium"
            shape="circle"
            src="https://i.pravatar.cc/150?img=2"
            alt="Medium"
          />
          <Avatar
            type="image"
            size="small"
            shape="circle"
            src="https://i.pravatar.cc/150?img=3"
            alt="Small"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Image - Square</h3>
        <div className="flex gap-4 items-center">
          <Avatar
            type="image"
            size="large"
            shape="square"
            src="https://i.pravatar.cc/150?img=4"
            alt="Large"
          />
          <Avatar
            type="image"
            size="medium"
            shape="square"
            src="https://i.pravatar.cc/150?img=5"
            alt="Medium"
          />
          <Avatar
            type="image"
            size="small"
            shape="square"
            src="https://i.pravatar.cc/150?img=6"
            alt="Small"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Initial - Circle</h3>
        <div className="flex gap-4 items-center">
          <Avatar type="initial" size="large" shape="circle" initials="AB" />
          <Avatar type="initial" size="medium" shape="circle" initials="CD" />
          <Avatar type="initial" size="small" shape="circle" initials="EF" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Initial - Square</h3>
        <div className="flex gap-4 items-center">
          <Avatar type="initial" size="large" shape="square" initials="GH" />
          <Avatar type="initial" size="medium" shape="square" initials="IJ" />
          <Avatar type="initial" size="small" shape="square" initials="KL" />
        </div>
      </div>
    </div>
  ),
};
