describe('Create Hotel and Book it', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');

    cy.get('input#email').type('user@example.com');
    cy.get('input#password').type('string');

    cy.get('form').contains('button', 'Connexion').click();

    cy.url().should('include', '/dashboard');
  });

  it('should create a new hotel and book it', () => {
    cy.contains('button', 'Hôtels').click();

    cy.contains('button', '+').click();
    cy.get('input[name="name"]').type('Nouvel Hôtel Test');
    cy.get('input[name="location"]').type('Paris, France');
    cy.get('textarea[name="description"]').type('Un hôtel test avec vue sur la tour Eiffel.');
    cy.get('input[type="file"]').selectFile('src/assets/picture2.jpg');

    cy.contains('button', 'Créer').click();
    cy.contains('Hôtel créé avec succès!', { timeout: 10000 }).should('be.visible');
    cy.contains('Nouvel Hôtel Test').should('be.visible');

    cy.visit('http://localhost:5173');

    cy.contains('.bg-white.rounded-lg.shadow-md', 'Nouvel Hôtel Test')
        .contains('Réserver maintenant')
        .click();

    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').should('be.visible');
    cy.wait(500);

    cy.get('#startDate').then($el => {
      const el = $el[0];
      el.value = '2025-03-18';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    cy.get('#endDate').then($el => {
      const el = $el[0];
      el.value = '2025-03-20';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    cy.get('#nbPerson').select('2', { force: true });

    cy.contains('Confirmer la réservation').click({ force: true });

    cy.get('.bg-green-100.text-green-800', { timeout: 10000 })
        .should('contain', 'Réservation effectuée avec succès!');
  });
});
