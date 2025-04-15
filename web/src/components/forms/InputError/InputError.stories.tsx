import { Meta, StoryObj } from "@storybook/react";
import InputError from "./InputError";

const meta: Meta<typeof InputError> = {
  title: "Forms/InputError",
  component: InputError,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InputError>Email is required</InputError>,
};

export const LongErrorMessage: Story = {
  render: () => (
    <InputError>
      The password must be at least 8 characters long and contain one uppercase
      letter, one lowercase letter, and a number.
    </InputError>
  ),
};
