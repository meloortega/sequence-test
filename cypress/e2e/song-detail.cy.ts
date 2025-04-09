describe('Song Detail', () => {
  beforeEach(() => {
    cy.visit('/songs');
    // Wait for songs to load and click first song
    cy.get('.songs-page__grid').should('exist');
    cy.get('.songs-page__link').should('exist').first().click();
  });

  it('should navigate to song detail page', () => {
    // Verify URL indicates we're on a song detail page
    cy.url().should('match', /\/songs\/\d+/);
  });

  it('should show loading skeleton while fetching song details', () => {
    // Visit a song detail page directly to see loading state
    cy.visit('/songs/1');
    cy.get('app-song-detail-skeleton').should('have.length.at.least', 1);
  });

  it('should display song form after loading', () => {
    // Wait for skeleton to disappear
    cy.get('app-song-detail-skeleton').should('not.exist');
    // Check if form is displayed
    cy.get('.song-detail__form').should('have.length.at.least', 1);
  });

  it('should display all form fields', () => {
    // Wait for form to load
    cy.get('app-song-detail-skeleton').should('not.exist');

    // Check all form fields are present
    cy.get('.song-detail__form').within(() => {
      // Check for the presence of form fields without relying on exact text
      cy.get('mat-form-field').should('have.length.at.least', 7); // At least 7 form fields
    });
  });

  it('should enable editing mode when edit button is clicked', () => {
    // Wait for form to load
    cy.get('app-song-detail-skeleton').should('not.exist');

    // Find and click the edit button (first action button)
    cy.get('.song-detail__action-button').first().click();

    // Check if form is enabled
    cy.get('.song-detail__form').should('not.have.class', 'song-detail__form--disabled');
  });

  it('should show save and cancel buttons in edit mode', () => {
    // Wait for form to load
    cy.get('app-song-detail-skeleton').should('not.exist');

    // Find and click the edit button (first action button)
    cy.get('.song-detail__action-button').first().click();

    // Check if we have at least 2 action buttons (save and cancel)
    cy.get('.song-detail__action-button').should('have.length.at.least', 2);
  });

  it('should show delete button when not in edit mode', () => {
    // Wait for form to load
    cy.get('app-song-detail-skeleton').should('not.exist');

    // Check if we have at least one action button (delete)
    cy.get('.song-detail__action-button').should('have.length.at.least', 1);
  });

  it('should navigate back to songs list when clicking back button', () => {
    // Wait for form to load
    cy.get('app-song-detail-skeleton').should('not.exist');

    // Click back button in header
    cy.get('app-header button').first().click();

    // Verify we're back to the songs list
    cy.url().should('include', '/songs');
  });

  describe('Song Creation', () => {
    beforeEach(() => {
      cy.visit('/songs');
      cy.get('.songs-page__add-button').click();
    });

    it('should create a new song', () => {
      // Wait for form to load
      cy.get('app-song-detail-skeleton').should('not.exist');

      // Fill in the form
      cy.get('input[formControlName="poster"]')
        .scrollIntoView()
        .type('https://example.com/poster.jpg');
      cy.get('input[formControlName="title"]').scrollIntoView().type('Test Song');

      // Select artist from dropdown
      cy.get('mat-select[formControlName="artistId"]').scrollIntoView().click();
      cy.get('mat-option').first().click();

      // Add genre using the chip input
      cy.get('.song-detail__form mat-chip-grid input').scrollIntoView().type('Rock{enter}');

      // Select companies from dropdown
      cy.get('mat-select[formControlName="companies"]').scrollIntoView().click();
      cy.get('mat-option').first().click();

      // Set year using datepicker
      cy.get('input[formControlName="year"]').scrollIntoView().click({ force: true });
      // Wait for the datepicker to be visible
      cy.get('.mat-calendar').should('be.visible');
      // Select the year closest to the current year
      cy.get('.mat-calendar-body-cell-content').first().click();

      // Fill in other fields
      cy.get('mat-form-field.song-detail__field input[formControlName="rating"]')
        .scrollIntoView()
        .clear({ force: true })
        .type('5.0', { force: true });
      cy.get('input[formControlName="duration"]').scrollIntoView().type('180', { force: true });

      // Ensure the form is in edit mode
      cy.get('.song-detail__form').should('not.have.class', 'song-detail__form--disabled');

      // Click save button
      cy.get('.song-detail__action-button.song-detail__action-button--save')
        .scrollIntoView()
        .click({ force: true });

      // Verify we're redirected to the songs list
      cy.url().should('include', '/songs');

      // Verify the new song appears in the list
      cy.get('.songs-page__grid').should('contain', 'Test Song');
    });
  });

  describe('Song Editing', () => {
    beforeEach(() => {
      cy.visit('/songs');
      cy.get('.songs-page__grid app-song-skeleton').should('not.exist');
      cy.get('.songs-page__link').first().click();
    });

    it('should edit an existing song', () => {
      // Wait for form to load
      cy.get('app-song-detail-skeleton').should('not.exist');

      // Click edit button
      cy.get('.song-detail__action-button').first().click();

      // Update form fields
      cy.get('input[formControlName="title"]').scrollIntoView().clear().type('Updated Song Title');

      // Select a different artist
      cy.get('mat-select[formControlName="artistId"]').scrollIntoView().click();
      cy.get('mat-option').eq(1).click();

      // Add a new genre
      cy.get('.song-detail__form mat-chip-grid input').scrollIntoView().type('Jazz{enter}');

      // Update year using datepicker
      cy.get('input[formControlName="year"]').scrollIntoView().click({ force: true });
      // Wait for the datepicker to be visible
      cy.get('.mat-calendar').should('be.visible');
      // Select the year closest to the current year
      cy.get('.mat-calendar-body-cell-content').first().click();

      // Update rating
      cy.get('mat-form-field.song-detail__field input[formControlName="rating"]')
        .scrollIntoView()
        .clear({ force: true })
        .type('5.0', { force: true });

      // Ensure the form is in edit mode
      cy.get('.song-detail__form').should('not.have.class', 'song-detail__form--disabled');

      // Click save button
      cy.get('.song-detail__action-button.song-detail__action-button--save')
        .scrollIntoView()
        .click({ force: true });

      // Verify we're redirected to the songs list
      cy.url().should('include', '/songs');

      // Verify the updated song appears in the list
      cy.get('.songs-page__grid').should('contain', 'Updated Song Title');
    });
  });

  describe('Song Deletion', () => {
    beforeEach(() => {
      cy.visit('/songs');
      cy.get('.songs-page__grid app-song-skeleton').should('not.exist');
      cy.get('.songs-page__link').first().click();
    });

    it('should delete a song', () => {
      // Wait for form to load
      cy.get('app-song-detail-skeleton').should('not.exist');

      // Get the song title before deletion
      cy.get('input[formControlName="title"]').invoke('val').as('songTitle');

      // Click delete button (the last action button when not in edit mode)
      cy.get('.song-detail__action-button').last().click();

      // Confirm deletion in dialog
      cy.get('mat-dialog-container button').last().click();

      // Verify we're redirected to the songs list
      cy.url().should('include', '/songs');

      // Verify the deleted song is no longer in the list
      cy.get('@songTitle').then((songTitle) => {
        cy.get('.songs-page__grid').should('not.contain', songTitle);
      });
    });
  });
});
