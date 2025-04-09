describe('Artists Page', () => {
  beforeEach(() => {
    cy.visit('/artists');
  });

  it('should display placeholder', () => {
    cy.get('app-not-found').should('be.visible');
  });
});
