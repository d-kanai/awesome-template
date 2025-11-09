import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxField } from "./CheckboxField";

const meta = {
  title: "Components/CheckboxField",
  component: CheckboxField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    indeterminate: {
      control: "boolean",
      description: "Whether the checkbox is in indeterminate state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
    label: {
      control: "text",
      description: "Label text for the checkbox",
    },
    description: {
      control: "text",
      description: "Description text shown below the checkbox",
    },
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultUnchecked: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};

export const DefaultChecked: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: true,
    disabled: false,
    indeterminate: false,
  },
};

export const DefaultIndeterminate: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: false,
    disabled: false,
    indeterminate: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: false,
    disabled: true,
    indeterminate: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: true,
    disabled: true,
    indeterminate: false,
  },
};

export const DisabledIndeterminate: Story = {
  args: {
    label: "Label",
    description: "Description",
    checked: false,
    disabled: true,
    indeterminate: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    label: "Label",
    checked: true,
    disabled: false,
    indeterminate: false,
  },
};

export const WithoutLabel: Story = {
  args: {
    description: "Description",
    checked: true,
    disabled: false,
    indeterminate: false,
  },
};

export const LongText: Story = {
  args: {
    label: "I agree to the terms and conditions of this service",
    description:
      "By checking this box, you acknowledge that you have read and understood all terms and conditions, privacy policies, and user agreements.",
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};
