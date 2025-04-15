import AuthFormFooter from "./AuthFormFooter";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AuthFormFooter> = {
  title: "Forms/AuthFormFooter",
  component: AuthFormFooter,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthFormFooter />,
  parameters: {
    layout: "centered",
  },
};
