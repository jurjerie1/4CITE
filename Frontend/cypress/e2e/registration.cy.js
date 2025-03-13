describe('User Registration', () => {
  it('should register a new user successfully', () => {
    cy.visit('http://localhost:5173/register');

    cy.get('input#email').type('newuser@example.com');
    cy.get('input#password').type('newpassword123');
    cy.get('input#pseudo').type('newuser');

    cy.get('form').contains('button', "S'inscrire").click();

    cy.contains('Utilisateur créé avec succès', { timeout: 10000 }).should('be.visible');
  });
});
