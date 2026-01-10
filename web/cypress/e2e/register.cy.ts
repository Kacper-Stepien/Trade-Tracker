describe("Register Flow", () => {
  beforeEach(() => {
    localStorage.setItem("i18nextLng", "en");

    cy.intercept("GET", "/api/users/me", { statusCode: 401 });
    cy.intercept("POST", "/api/auth/refresh", { statusCode: 401 });

    cy.visit("/register");
  });

  it("displays validation error on invalid email", () => {
    fillForm("invalid-email");
    cy.contains(/email is incorrect/i).should("exist");
  });

  it("displays validation error on short password", () => {
    fillForm("admin@example.com", "1");
    cy.contains(/Password must be at least 8 characters long/i).should("exist");
  });

  it("shows error if user with given email already exists", () => {
    cy.intercept("POST", "/api/auth/sign-up", {
      statusCode: 409,
      body: {
        message: "USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS",
        error: "Conflict",
        statusCode: 409,
      },
    }).as("register");

    fillForm("existing.user@example.com");
    cy.get("button")
      .contains(/sign up/i)
      .click();

    cy.wait("@register");
    cy.contains(/User with this email already exists/i).should("exist");
  });

  it("registers successfully and redirects to login", () => {
    cy.intercept("POST", "/api/auth/sign-up", {
      statusCode: 201,
      body: {},
    }).as("register");

    fillForm("new.user@example.com");
    cy.get("button")
      .contains(/sign up/i)
      .click();

    cy.wait("@register");
    cy.url().should("include", "/login");
  });

  function fillForm(email: string, password: string = "Password123") {
    cy.get('input[id="name"]').type("John");
    cy.get('input[id="surname"]').type("Doe");
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.get('input[id="confirmPassword"]').type("Password123");
    cy.get('[data-testid="CalendarIcon"]').click();
    cy.get('[role="gridcell"]').contains("15").click();
    cy.get('input[type="checkbox"]').check();
    cy.get('input[type="checkbox"]').check();
  }
});
