import { screen } from "@testing-library/react";
import Footer from "./Footer";
import { renderWithProviders } from "../../test_utils/helpers";
import { SOCIAL_LINKS } from "./socialLinks";

describe("Footer", () => {
  beforeEach(() => {
    renderWithProviders(<Footer />);
  });

  it("renders the logo", () => {
    const logo = screen.getByLabelText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders all social media links", () => {
    SOCIAL_LINKS.forEach(({ name }) => {
      const link = screen.getByRole("link", { name: new RegExp(name, "i") });
      expect(link).toBeInTheDocument();
    });
  });

  it("renders the about section", () => {
    const about = screen.getByRole("heading", { name: /about/i });
    expect(about).toBeInTheDocument();
  });

  it("renders the contact section", () => {
    const email = screen.getByLabelText("email");
    const phone = screen.getByLabelText("phone");
    expect(email).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
  });
});
