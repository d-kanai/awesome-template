import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HeaderAuth } from "./HeaderAuth";

const meta = {
  title: "Components/HeaderAuth",
  component: HeaderAuth,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["Logged Out", "Logged In", "Logged In - Hover"],
      description: "Authentication state",
    },
    avatarSrc: {
      control: "text",
      description: "Avatar image URL",
    },
    avatarAlt: {
      control: "text",
      description: "Avatar alt text",
    },
    onSignIn: {
      action: "sign in clicked",
    },
    onRegister: {
      action: "register clicked",
    },
    onAvatarClick: {
      action: "avatar clicked",
    },
  },
} satisfies Meta<typeof HeaderAuth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    state: "Logged Out",
  },
};

export const LoggedIn: Story = {
  args: {
    state: "Logged In",
    avatarSrc: "https://i.pravatar.cc/40?img=1",
    avatarAlt: "User",
  },
};

export const LoggedInHover: Story = {
  args: {
    state: "Logged In - Hover",
    avatarSrc: "https://i.pravatar.cc/40?img=1",
    avatarAlt: "User",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Logged Out</h3>
        <HeaderAuth state="Logged Out" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Logged In</h3>
        <HeaderAuth
          state="Logged In"
          avatarSrc="https://i.pravatar.cc/40?img=2"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Logged In - Hover</h3>
        <HeaderAuth
          state="Logged In - Hover"
          avatarSrc="https://i.pravatar.cc/40?img=2"
        />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isHover, setIsHover] = React.useState(false);

    const handleSignIn = () => {
      setIsLoggedIn(true);
      console.log("Sign in clicked");
    };

    const handleRegister = () => {
      setIsLoggedIn(true);
      console.log("Register clicked");
    };

    const handleAvatarClick = () => {
      setIsLoggedIn(false);
      setIsHover(false);
      console.log("Avatar clicked - logging out");
    };

    if (!isLoggedIn) {
      return <HeaderAuth state="Logged Out" onSignIn={handleSignIn} onRegister={handleRegister} />;
    }

    return (
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <HeaderAuth
          state={isHover ? "Logged In - Hover" : "Logged In"}
          avatarSrc="https://i.pravatar.cc/40?img=3"
          onAvatarClick={handleAvatarClick}
        />
      </div>
    );
  },
};

export const DifferentAvatars: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <HeaderAuth
        state="Logged In"
        avatarSrc="https://i.pravatar.cc/40?img=5"
        avatarAlt="Alice"
      />
      <HeaderAuth
        state="Logged In"
        avatarSrc="https://i.pravatar.cc/40?img=8"
        avatarAlt="Bob"
      />
      <HeaderAuth
        state="Logged In"
        avatarSrc="https://i.pravatar.cc/40?img=12"
        avatarAlt="Charlie"
      />
    </div>
  ),
};
