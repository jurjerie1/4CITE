describe('Booking Management CRUD Operations', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');

        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('string');

        cy.get('form').contains('button', 'Connexion').click();

        cy.url().should('include', '/dashboard');

        cy.contains('button', 'Toutes les réservations').click();
    });

    it('should update an existing booking', () => {
        cy.get('.bg-white.rounded-lg.shadow-md').first().as('bookingCard');
        cy.get('@bookingCard').contains('Modifier').scrollIntoView().click({ force: true });

        cy.get('input[name="StartDate"]').as('startDate');
        cy.get('@startDate').clear();
        cy.get('@startDate').type('2024-12-01');

        cy.get('input[name="EndDate"]').as('endDate');
        cy.get('@endDate').clear();
        cy.get('@endDate').type('2024-12-10');

        cy.get('input[name="nbPerson"]').as('nbPerson');
        cy.get('@nbPerson').clear();
        cy.get('@nbPerson').type('3');

        cy.contains('button', 'Modifiez').click();

        cy.contains('Modification...', { timeout: 10000 }).should('not.exist');
        cy.contains('Modifier la réservation').should('not.exist');
    });

    it('should delete an existing booking', () => {
        cy.get('.bg-white.rounded-lg.shadow-md').first().as('bookingCard');
        cy.get('@bookingCard').contains('Supprimer').scrollIntoView().click({ force: true });

        cy.on('window:confirm', () => true);
    });
});