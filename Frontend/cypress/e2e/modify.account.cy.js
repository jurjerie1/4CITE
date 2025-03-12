describe('User Profile Update', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');

        cy.get('input#email').type('newuser@example.com');
        cy.get('input#password').type('newpassword123');

        cy.get('form').contains('button', 'Connexion').click();

        cy.url().should('include', '/dashboard');

        cy.contains('button', 'Profil').click();
    });

    it('should update user profile information', () => {
        cy.get('input[name="pseudo"]').clear().type('newpseudo');
        cy.get('input[name="email"]').clear().type('newemail@example.com');
        cy.get('input[name="password"]').type('newpassword123');

        cy.contains('button', 'Enregistrer les modifications').click();

        cy.contains('Profil mis à jour avec succès!', { timeout: 10000 }).should('be.visible');

        cy.get('input[name="pseudo"]').should('have.value', 'newpseudo');
        cy.get('input[name="email"]').should('have.value', 'newemail@example.com');
    });
});
