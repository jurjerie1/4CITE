describe('Hotel Management CRUD Operations', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');

        cy.get('input#email').type('user@example.com');
        cy.get('input#password').type('string');

        cy.get('form').contains('button', 'Connexion').click();

        cy.url().should('include', '/dashboard');

        cy.contains('button', 'Hôtels').click();
    });

    it('should create a new hotel', () => {
        cy.contains('button', '+').click();

        cy.get('input[name="name"]').type('Nouvel Hôtel');
        cy.get('input[name="location"]').type('Paris, France');
        cy.get('textarea[name="description"]').type('Un hôtel magnifique avec vue sur la tour Eiffel.');

        cy.get('input[type="file"]').selectFile('src/assets/picture2.jpg');

        cy.contains('button', 'Créer').click();

        cy.contains('Hôtel créé avec succès!', { timeout: 10000 }).should('be.visible');

        cy.contains('Nouvel Hôtel').should('be.visible');
    });

    it('should update an existing hotel', () => {
        cy.get('.bg-white.rounded-lg.shadow-md').first().contains('Modifier').scrollIntoView().click({ force: true });

        cy.get('input[name="name"]').clear().type('Hôtel Mis à Jour');
        cy.get('input[name="location"]').clear().type('Lyon, France');
        cy.get('textarea[name="description"]').clear().type('Un hôtel mis à jour avec une nouvelle description.');

        cy.contains('button', 'Modifiez').click();

        cy.contains('Hôtel mis à jour avec succès!', { timeout: 10000 }).should('be.visible');

        cy.contains('Hôtel Mis à Jour').should('be.visible');
    });

    it('should delete an existing hotel', () => {
        cy.get('.bg-white.rounded-lg.shadow-md').first().contains('Supprimer').scrollIntoView().click({ force: true });

        cy.on('window:confirm', () => true);

        cy.contains('Hôtel supprimé avec succès!', { timeout: 10000 }).should('be.visible');

        cy.contains('Nouvel Hôtel').should('not.exist');
    });
});
