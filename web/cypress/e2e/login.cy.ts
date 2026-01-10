describe("Login Flow", () => {
  beforeEach(() => {
    localStorage.setItem("i18nextLng", "en");

    cy.intercept("GET", "/api/users/me", {
      statusCode: 401,
      body: { message: "Unauthorized" },
    }).as("getUserMe");

    cy.intercept("POST", "/api/auth/refresh", {
      statusCode: 401,
      body: { message: "Token expired" },
    }).as("tokenRefresh");

    cy.visit("/login");
  });

  it("allows a user to log in with valid credentials", () => {
    cy.intercept("POST", "/api/auth/sign-in", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          name: "John",
          surname: "Doe",
          email: "john.doe@example.com",
          dateOfBirth: "1990-01-01",
          isProfessional: false,
          role: "user",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
      },
    }).as("login");

    cy.get('input[id="email"]').type("john.doe@example.com");
    cy.get('input[id="password"]').type("securePassword123");

    cy.get("button")
      .contains(/sign in/i)
      .click();

    cy.wait("@login");

    cy.url().should("not.include", "/login");
  });
});
