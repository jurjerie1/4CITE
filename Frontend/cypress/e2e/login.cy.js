describe('User Login', () => {
    it('should login user', () => {
        cy.visit('http://localhost:5173/login');

        cy.get('input#email').type('newuser@example.com');
        cy.get('input#password').type('newpassword123');

        cy.get('form').contains('button', 'Connexion').click();

        cy.url().should('include', '/dashboard');
    });
});
