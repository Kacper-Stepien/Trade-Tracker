import { Meta, StoryObj } from "@storybook/react";
import FormSuccess from "./FormSuccess";

const meta: Meta<typeof FormSuccess> = {
  title: "Forms/FormSuccess",
  component: FormSuccess,
  tags: ["autodocs"],
  args: {
    children: "Your account has been successfuly created!",
  },
  argTypes: {
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FormSuccess>;

export const Default: Story = {};
