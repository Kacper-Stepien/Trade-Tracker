import { render, screen } from "@testing-library/react";
import AuthFormFooter from "./AuthFormFooter";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../utils/i18n";

describe("AuthFormFooter", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <AuthFormFooter />
      </I18nextProvider>
    );
  });

  it("should render the Google button", () => {
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/google/i);
  });
});
