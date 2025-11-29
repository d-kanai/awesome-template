import type { Meta, StoryObj } from "@storybook/react";
import { TextContentHeading } from "./TextContentHeading";

const meta = {
  title: "Components/TextContentHeading",
  component: TextContentHeading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    heading: {
      control: "text",
      description: "Main heading text",
    },
    subheading: {
      control: "text",
      description: "Subheading text",
    },
    hasSubheading: {
      control: "boolean",
      description: "Show or hide subheading",
    },
    align: {
      control: "select",
      options: ["Start", "Center"],
      description: "Text alignment",
    },
  },
} satisfies Meta<typeof TextContentHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {
  args: {
    align: "Start",
    heading: "Heading",
    subheading: "Subheading",
    hasSubheading: true,
  },
};

export const Center: Story = {
  args: {
    align: "Center",
    heading: "Heading",
    subheading: "Subheading",
    hasSubheading: true,
  },
};

export const WithoutSubheading: Story = {
  args: {
    align: "Start",
    heading: "Heading Only",
    hasSubheading: false,
  },
};

export const LongContent: Story = {
  args: {
    align: "Start",
    heading: "A Longer Heading That Might Span Multiple Lines",
    subheading: "This is a longer subheading that provides additional context",
    hasSubheading: true,
  },
};

export const AllVariants: Story = {
  args: {
    heading: "Sample Heading",
    subheading: "Sample Subheading",
  },
  render: () => (
    <div className="flex flex-col gap-12 items-start w-full">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Start Alignment</h3>
        <TextContentHeading
          align="Start"
          heading="What Our Customers Say"
          subheading="Trusted by teams worldwide"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Center Alignment</h3>
        <TextContentHeading
          align="Center"
          heading="What Our Customers Say"
          subheading="Trusted by teams worldwide"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-sm font-semibold">Without Subheading</h3>
        <TextContentHeading
          align="Start"
          heading="Features"
          hasSubheading={false}
        />
      </div>
    </div>
  ),
};

export const SectionHeader: Story = {
  args: {
    heading: "Sample Heading",
    subheading: "Sample Subheading",
  },
  render: () => (
    <div className="w-full max-w-4xl">
      <TextContentHeading
        align="Start"
        heading="Our Features"
        subheading="Everything you need to succeed"
      />
    </div>
  ),
};

export const CenteredSection: Story = {
  args: {
    heading: "Sample Heading",
    subheading: "Sample Subheading",
  },
  render: () => (
    <div className="w-full max-w-4xl">
      <TextContentHeading
        align="Center"
        heading="Testimonials"
        subheading="See what our customers have to say"
      />
    </div>
  ),
};

export const Comparison: Story = {
  args: {
    heading: "Sample Heading",
    subheading: "Sample Subheading",
  },
  render: () => (
    <div className="flex gap-8">
      <div className="flex-1 border border-gray-200 p-8 rounded-lg">
        <h3 className="text-sm font-semibold mb-4">Start Aligned</h3>
        <TextContentHeading
          align="Start"
          heading="Products"
          subheading="Explore our offerings"
        />
      </div>
      <div className="flex-1 border border-gray-200 p-8 rounded-lg">
        <h3 className="text-sm font-semibold mb-4">Center Aligned</h3>
        <TextContentHeading
          align="Center"
          heading="Products"
          subheading="Explore our offerings"
        />
      </div>
    </div>
  ),
};
