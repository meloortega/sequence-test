describe('Companies Page', () => {
  beforeEach(() => {
    cy.visit('/companies');
  });

  it('should display placeholder', () => {
    cy.get('app-not-found').should('be.visible');
  });
});
