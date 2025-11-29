import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["Justify", "Start", "End", "Center", "Stack"],
      description: "Button group alignment",
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Justify: Story = {
  args: {
    align: "Justify",
  },
};

export const Start: Story = {
  args: {
    align: "Start",
  },
};

export const End: Story = {
  args: {
    align: "End",
  },
};

export const Center: Story = {
  args: {
    align: "Center",
  },
};

export const Stack: Story = {
  args: {
    align: "Stack",
  },
};

export const CustomLabels: Story = {
  args: {
    align: "Justify",
    startButton: {
      label: "Cancel",
      variant: "neutral",
    },
    endButton: {
      label: "Confirm",
      variant: "primary",
    },
  },
};

export const AllAlignments: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Justify</h3>
        <ButtonGroup align="Justify" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Start</h3>
        <ButtonGroup align="Start" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">End</h3>
        <ButtonGroup align="End" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Center</h3>
        <ButtonGroup align="Center" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Stack</h3>
        <ButtonGroup align="Stack" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [lastClicked, setLastClicked] = React.useState<string>("");

    return (
      <div className="flex flex-col gap-4 items-center">
        <ButtonGroup
          align="Justify"
          startButton={{
            label: "Cancel",
            variant: "neutral",
            onClick: () => setLastClicked("Cancel"),
          }}
          endButton={{
            label: "Confirm",
            variant: "primary",
            onClick: () => setLastClicked("Confirm"),
          }}
        />
        {lastClicked && (
          <p className="text-sm text-gray-600">
            Last clicked: <strong>{lastClicked}</strong>
          </p>
        )}
      </div>
    );
  },
};

export const SingleButton: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Start Button Only</h3>
        <ButtonGroup
          align="Justify"
          startButton={{ label: "Single Button", variant: "neutral" }}
          endButton={undefined}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">End Button Only</h3>
        <ButtonGroup
          align="Justify"
          startButton={undefined}
          endButton={{ label: "Single Button", variant: "primary" }}
        />
      </div>
    </div>
  ),
};

export const DialogActions: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Dialog Action Buttons</h3>
      <ButtonGroup
        align="End"
        startButton={{
          label: "Cancel",
          variant: "neutral",
        }}
        endButton={{
          label: "Save",
          variant: "primary",
        }}
      />
    </div>
  ),
};

export const FormActions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-sm font-semibold">Form Action Buttons</h3>
      <ButtonGroup
        align="Stack"
        startButton={{
          label: "Reset Form",
          variant: "neutral",
        }}
        endButton={{
          label: "Submit",
          variant: "primary",
        }}
      />
    </div>
  ),
};
