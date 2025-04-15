import type { Meta, StoryObj } from "@storybook/react";
import ThemeButton from "./ThemeButton";
import { ThemeProvider } from "../../../context/ThemeContext/ThemeContext";

const meta = {
  title: "Components/ThemeButton",
  component: ThemeButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
