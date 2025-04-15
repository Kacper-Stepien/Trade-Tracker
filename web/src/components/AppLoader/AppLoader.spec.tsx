import { screen } from "@testing-library/react";
import AppLoader from "./AppLoader";
import { renderWithTheme } from "../../test_utils/helpers";

describe("AppLoader", () => {
  it("renders loading spinner", () => {
    renderWithTheme(<AppLoader />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
