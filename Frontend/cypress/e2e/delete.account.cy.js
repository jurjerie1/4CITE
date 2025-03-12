describe('User Profile Delete', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/login');

        cy.get('input#email').type('newuser@example.com');
        cy.get('input#password').type('newpassword123');

        cy.get('form').contains('button', 'Connexion').click();

        cy.url().should('include', '/dashboard');

        cy.contains('button', 'Profil').click();
    });

    it('should delete user', () => {
        cy.contains('button', 'Supprimer le profil').click();
});
});
