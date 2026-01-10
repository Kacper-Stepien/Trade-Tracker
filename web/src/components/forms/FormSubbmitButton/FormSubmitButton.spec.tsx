import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test_utils/helpers";
import FormSubmitButton from "./FormSubmitButton";
import { userEvent } from "@storybook/test";

describe("FormSubmittButton", () => {
  it("renders the button with default children", () => {
    renderWithProviders(<FormSubmitButton>Submit</FormSubmitButton>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  it("disables the button when isLoading is true", () => {
    renderWithProviders(
      <FormSubmitButton isLoading={true}>Submit</FormSubmitButton>
    );
    const button = screen.getByRole("button");
    expect(screen.queryByText(/submit/i)).not.toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("shows loader instead of children when loading", () => {
    renderWithProviders(
      <FormSubmitButton isLoading={true}>Submit</FormSubmitButton>
    );
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
    const button = screen.queryByRole("button", { name: /submit/i });
    expect(button).not.toBeInTheDocument();
  });

  it("respects disabled prop", () => {
    renderWithProviders(
      <FormSubmitButton disabled={true}>Submit</FormSubmitButton>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when clicked (if not disabled)", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(
      <FormSubmitButton onClick={handleClick}>Submit</FormSubmitButton>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
