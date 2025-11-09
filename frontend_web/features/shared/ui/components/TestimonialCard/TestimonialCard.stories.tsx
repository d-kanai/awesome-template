import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCard } from "./TestimonialCard";

const meta = {
  title: "Components/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    quote: {
      control: "text",
      description: "Testimonial quote text",
    },
    title: {
      control: "text",
      description: "Person's name or title",
    },
    description: {
      control: "text",
      description: "Person's role or company",
    },
    avatarSrc: {
      control: "text",
      description: "Avatar image URL",
    },
    avatarAlt: {
      control: "text",
      description: "Avatar alt text",
    },
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote:
      "This product has completely transformed how we work. Highly recommended!",
    title: "Sarah Johnson",
    description: "CEO, TechCorp",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
    avatarAlt: "Sarah Johnson",
  },
};

export const LongQuote: Story = {
  args: {
    quote:
      "Working with this team has been an absolute pleasure. Their attention to detail and commitment to excellence is unmatched in the industry. I couldn't be happier with the results.",
    title: "Michael Chen",
    description: "Product Manager, StartupXYZ",
    avatarSrc: "https://i.pravatar.cc/150?img=2",
    avatarAlt: "Michael Chen",
  },
};

export const ShortQuote: Story = {
  args: {
    quote: "Simply amazing!",
    title: "Emma Wilson",
    description: "Designer",
    avatarSrc: "https://i.pravatar.cc/150?img=3",
    avatarAlt: "Emma Wilson",
  },
};

export const MultipleCards: Story = {
  args: {
    quote: "Sample quote",
    title: "Sample Title",
    description: "Sample Description",
  },
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <TestimonialCard
        quote="This product has completely transformed how we work. Highly recommended!"
        title="Sarah Johnson"
        description="CEO, TechCorp"
        avatarSrc="https://i.pravatar.cc/150?img=1"
        avatarAlt="Sarah Johnson"
      />
      <TestimonialCard
        quote="The best investment we've made for our business this year."
        title="Michael Chen"
        description="Product Manager, StartupXYZ"
        avatarSrc="https://i.pravatar.cc/150?img=2"
        avatarAlt="Michael Chen"
      />
      <TestimonialCard
        quote="Outstanding service and support. The team really cares about their customers."
        title="Emma Wilson"
        description="Designer, Creative Agency"
        avatarSrc="https://i.pravatar.cc/150?img=3"
        avatarAlt="Emma Wilson"
      />
    </div>
  ),
};
