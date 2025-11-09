import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CardGridTestimonials } from "./CardGridTestimonials";

const meta = {
  title: "Components/CardGridTestimonials",
  component: CardGridTestimonials,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    heading: {
      control: "text",
      description: "Section heading",
    },
    subheading: {
      control: "text",
      description: "Section subheading",
    },
    hasSubheading: {
      control: "boolean",
      description: "Show or hide subheading",
    },
    testimonials: {
      control: "object",
      description: "Array of testimonials",
    },
  },
} satisfies Meta<typeof CardGridTestimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTestimonials = [
  {
    quote: "This product has completely transformed how we work. Highly recommended!",
    title: "Sarah Johnson",
    description: "CEO, TechCorp",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
    avatarAlt: "Sarah Johnson",
  },
  {
    quote: "The best investment we've made for our business this year.",
    title: "Michael Chen",
    description: "Product Manager, StartupXYZ",
    avatarSrc: "https://i.pravatar.cc/150?img=2",
    avatarAlt: "Michael Chen",
  },
  {
    quote: "Outstanding service and support. The team really cares about their customers.",
    title: "Emma Wilson",
    description: "Designer, Creative Agency",
    avatarSrc: "https://i.pravatar.cc/150?img=3",
    avatarAlt: "Emma Wilson",
  },
];

export const Desktop: Story = {
  args: {
    heading: "What Our Customers Say",
    subheading: "Trusted by teams worldwide",
    hasSubheading: true,
    testimonials: sampleTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive", // 1200px
    },
  },
};

export const Mobile: Story = {
  args: {
    heading: "What Our Customers Say",
    subheading: "Trusted by teams worldwide",
    hasSubheading: true,
    testimonials: sampleTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1", // 375px
    },
  },
};

export const WithoutSubheading: Story = {
  args: {
    heading: "Customer Testimonials",
    hasSubheading: false,
    testimonials: sampleTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

export const TwoTestimonials: Story = {
  args: {
    heading: "What People Are Saying",
    subheading: "Real feedback from real customers",
    hasSubheading: true,
    testimonials: sampleTestimonials.slice(0, 2),
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

export const SingleTestimonial: Story = {
  args: {
    heading: "Featured Testimonial",
    subheading: "From our valued customer",
    hasSubheading: true,
    testimonials: [sampleTestimonials[0]],
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

export const ManyTestimonials: Story = {
  args: {
    heading: "Loved by Thousands",
    subheading: "See what our customers have to say",
    hasSubheading: true,
    testimonials: [
      ...sampleTestimonials,
      {
        quote: "Incredible experience from start to finish.",
        title: "James Brown",
        description: "CTO, Enterprise Inc",
        avatarSrc: "https://i.pravatar.cc/150?img=4",
        avatarAlt: "James Brown",
      },
      {
        quote: "A game changer for our team's productivity.",
        title: "Lisa Anderson",
        description: "Operations Manager, Global Solutions",
        avatarSrc: "https://i.pravatar.cc/150?img=5",
        avatarAlt: "Lisa Anderson",
      },
      {
        quote: "Simple, powerful, and exactly what we needed.",
        title: "David Lee",
        description: "Founder, StartupHub",
        avatarSrc: "https://i.pravatar.cc/150?img=6",
        avatarAlt: "David Lee",
      },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};
