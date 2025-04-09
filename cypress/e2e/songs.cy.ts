describe('Songs Page', () => {
  beforeEach(() => {
    cy.visit('/songs');
  });

  it('should display the songs page', () => {
    cy.get('app-songs-page').should('be.visible');
    cy.get('app-header').should('be.visible');
    cy.get('app-content').should('be.visible');
  });

  it('should show loading skeletons while fetching songs', () => {
    cy.get('.songs-page__grid app-song-skeleton').should('have.length.at.least', 1);
  });

  it('should display song list after loading', () => {
    // Wait for skeletons to disappear
    cy.get('.songs-page__grid app-song-skeleton').should('not.exist');
    // Check if song items are displayed
    cy.get('.songs-page__grid app-song').should('be.visible');
  });

  it('should navigate to song detail when clicking a song', () => {
    // Wait for songs to load
    cy.get('.songs-page__grid app-song-skeleton').should('not.exist');
    // Click first song
    cy.get('.songs-page__link').first().click();
    // Check if URL changed to song detail
    cy.url().should('match', /\/songs\/\d+/);
  });

  it('should show add song button', () => {
    cy.get('.songs-page__add-button').should('be.visible');
  });

  it('should have search functionality', () => {
    cy.get('app-header input[type="text"]').should('be.visible');
  });

  it('should show empty state when no songs match search', () => {
    // Type a search query that won't match any songs
    cy.get('app-header input[type="text"]').type('nonexistentsong123');

    // Check if empty state is shown
    cy.get('app-loading').should('be.visible');

    // Verify that the empty state has some text content
    // This is more resilient to translations
    cy.get('app-loading').should('not.be.empty');
  });
});
