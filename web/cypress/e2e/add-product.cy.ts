describe('Add Product Flow (Real API)', () => {
  const testUser = {
    email: 'cypress-test@example.com',
    password: 'TestPassword123!',
  };

  const testProduct = {
    name: `Test Product ${Date.now()}`,
    price: 99.99,
    description: 'This is a test product created by Cypress',
  };

  beforeEach(() => {
    // Set language
    localStorage.setItem('i18nextLng', 'en');
  });

  afterEach(() => {
    // Clean up: Delete test product via API
    // This ensures no test data persists in your database
    const apiUrl = Cypress.env('apiUrl');

    cy.getCookie('refreshToken').then((cookie) => {
      if (cookie) {
        // Get auth token from localStorage/cookie
        cy.window().then((win) => {
          const token = win.localStorage.getItem('auth-token');

          // Delete products created during test
          cy.request({
            method: 'DELETE',
            url: `${apiUrl}/products/test-cleanup`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              namePattern: 'Test Product',
            },
            failOnStatusCode: false, // Don't fail if endpoint doesn't exist yet
          });
        });
      }
    });
  });

  it('allows authenticated user to add a product', () => {
    // Step 1: Login via UI (tests the full login flow)
    cy.login(testUser.email, testUser.password);

    // Step 2: Navigate to add product page
    cy.url().should('not.include', '/login');
    cy.contains('Add Product').click(); // Adjust selector based on your UI
    cy.url().should('include', '/products/add');

    // Step 3: Fill out product form
    cy.get('input[name="name"]').type(testProduct.name);
    cy.get('input[name="price"]').type(testProduct.price.toString());
    cy.get('textarea[name="description"]').type(testProduct.description);

    // Step 4: Submit form (real API call happens here)
    cy.get('button[type="submit"]').click();

    // Step 5: Verify success
    cy.contains('Product added successfully').should('be.visible');

    // Step 6: Verify product appears in the list (read from real DB)
    cy.visit('/products');
    cy.contains(testProduct.name).should('be.visible');
  });

  it('validates required fields before submitting', () => {
    // Login faster via API for this test
    cy.loginByApi(testUser.email, testUser.password);
    cy.visit('/products/add');

    // Try to submit empty form
    cy.get('button[type="submit"]').click();

    // Should show validation errors (no API call made)
    cy.contains('Name is required').should('be.visible');
    cy.contains('Price is required').should('be.visible');
  });
});
