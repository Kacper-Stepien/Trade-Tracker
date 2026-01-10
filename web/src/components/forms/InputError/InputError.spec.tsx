import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test_utils/helpers";
import InputError from "./InputError";

describe("InputError", () => {
  it("renders error alert with children", () => {
    renderWithProviders(<InputError>Something went wrong</InputError>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/something went wrong/i);
  });
});
