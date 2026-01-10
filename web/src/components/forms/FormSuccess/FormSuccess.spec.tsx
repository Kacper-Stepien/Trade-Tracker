import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test_utils/helpers";
import FormSuccess from "./FormSuccess";

describe("FormSuccess", () => {
  it("renders success alert with children", () => {
    renderWithProviders(<FormSuccess>Success message</FormSuccess>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/success message/i);
  });
});
