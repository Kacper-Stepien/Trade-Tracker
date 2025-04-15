import type { Meta, StoryObj } from "@storybook/react";
import ChangeLanguageButton from "./ChangeLanguageButton";
import { userEvent, within } from "@storybook/test";

const meta = {
  title: "Components/ChangeLanguageButton",
  component: ChangeLanguageButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChangeLanguageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Opened: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
  },
};
