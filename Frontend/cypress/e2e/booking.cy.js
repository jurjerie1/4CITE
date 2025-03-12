describe('Hotel Booking', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');

    cy.get('input#email').type('newuser@example.com');
    cy.get('input#password').type('newpassword123');

    cy.get('form').contains('button', 'Connexion').click();

    cy.url().should('include', '/dashboard');

    cy.visit('http://localhost:5173');
  });

  it('should book a hotel', () => {
    cy.get('.bg-white.rounded-lg.shadow-md').first().contains('Réserver maintenant').click();

    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').should('be.visible');

    cy.wait(500);

    cy.get('#startDate').then($el => {
      const el = $el[0];
      el.value = '2024-12-01';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    cy.get('#endDate').then($el => {
      const el = $el[0];
      el.value = '2024-12-05';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    cy.get('#nbPerson').select('2', { force: true });

    cy.contains('Confirmer la réservation').click({ force: true });

    cy.get('.bg-green-100.text-green-800', { timeout: 10000 }).should('contain', 'Réservation effectuée avec succès!');
  });
});
