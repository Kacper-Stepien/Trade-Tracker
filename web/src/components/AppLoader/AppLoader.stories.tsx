import { Meta, StoryObj } from "@storybook/react";
import AppLoader from "./AppLoader";

const meta: Meta<typeof AppLoader> = {
  title: "AppLoader",
  component: AppLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppLoader>;

export const Default: Story = {
  render: () => <AppLoader />,
};
