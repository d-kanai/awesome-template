import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "./InputField";

const meta = {
  title: "Components/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["default", "error", "disabled"],
      description: "入力フィールドの状態",
    },
    hasLabel: {
      control: "boolean",
      description: "ラベルの表示",
    },
    hasError: {
      control: "boolean",
      description: "エラーメッセージの表示",
    },
    hasDescription: {
      control: "boolean",
      description: "説明文の表示",
    },
    label: {
      control: "text",
      description: "ラベルテキスト",
    },
    placeholder: {
      control: "text",
      description: "プレースホルダー",
    },
    error: {
      control: "text",
      description: "エラーメッセージ",
    },
    description: {
      control: "text",
      description: "説明文",
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default state stories
export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Value",
    hasLabel: true,
    state: "default",
  },
};

export const DefaultWithValue: Story = {
  args: {
    label: "Label",
    defaultValue: "Value",
    hasLabel: true,
    state: "default",
  },
};

export const DefaultWithDescription: Story = {
  args: {
    label: "Label",
    placeholder: "Value",
    description: "Description",
    hasLabel: true,
    hasDescription: true,
    state: "default",
  },
};

// Error state stories
export const Error: Story = {
  args: {
    label: "Label",
    placeholder: "Value",
    error: "Error",
    hasLabel: true,
    hasError: true,
    state: "error",
  },
};

export const ErrorWithValue: Story = {
  args: {
    label: "Label",
    defaultValue: "Value",
    error: "Error",
    hasLabel: true,
    hasError: true,
    state: "error",
  },
};

// Disabled state stories
export const Disabled: Story = {
  args: {
    label: "Label",
    placeholder: "Value",
    hasLabel: true,
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: "Label",
    defaultValue: "Value",
    hasLabel: true,
    disabled: true,
  },
};

// All states comparison
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[320px]">
      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Default State</h3>
        <InputField label="Label" placeholder="Placeholder" hasLabel />
        <InputField label="Label" defaultValue="Value" hasLabel />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Error State</h3>
        <InputField
          label="Label"
          placeholder="Placeholder"
          error="Error message"
          hasLabel
          hasError
          state="error"
        />
        <InputField
          label="Label"
          defaultValue="Value"
          error="Error message"
          hasLabel
          hasError
          state="error"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">Disabled State</h3>
        <InputField label="Label" placeholder="Placeholder" hasLabel disabled />
        <InputField label="Label" defaultValue="Value" hasLabel disabled />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-heading">With Description</h3>
        <InputField
          label="Label"
          placeholder="Placeholder"
          description="This is a description text"
          hasLabel
          hasDescription
        />
      </div>
    </div>
  ),
};
