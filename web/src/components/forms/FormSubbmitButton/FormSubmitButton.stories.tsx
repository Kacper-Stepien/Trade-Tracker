import { Meta, StoryObj } from "@storybook/react";
import FormSubmitButton from "./FormSubmitButton";

const meta: Meta<typeof FormSubmitButton> = {
  title: "Forms/FormSubmitButton",
  component: FormSubmitButton,
  tags: ["autodocs"],
  args: {
    children: "Submit",
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FormSubmitButton>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
