describe('User Registration and Login', () => {
  it('should register a new user and login', () => {
    // Naviguer vers la page d'inscription
    cy.visit('http://localhost:5173/register');

    // Remplir le formulaire d'inscription
    cy.get('input#email').type('newuser@example.com');
    cy.get('input#password').type('newpassword123');
    cy.get('input#pseudo').type('newuser');

    // Soumettre le formulaire d'inscription
    cy.get('form').contains('button', "S'inscrire").click();

    // Vérifier si l'inscription est réussie ou si le compte existe déjà
    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/login')) {
        // Si redirigé vers la page de connexion, continuer avec la connexion
        cy.get('input#email').type('newuser@example.com');
        cy.get('input#password').type('newpassword123');
        cy.get('form').contains('button', 'Connexion').click();
      } else {
        // Attendre que l'inscription soit complète
        cy.contains('Inscription réussie', { timeout: 10000 }).should('be.visible');

        // Naviguer vers la page de connexion
        cy.visit('http://localhost:5173/login');

        // Remplir le formulaire de connexion
        cy.get('input#email').type('newuser@example.com');
        cy.get('input#password').type('newpassword123');

        // Soumettre le formulaire de connexion
        cy.get('form').contains('button', 'Connexion').click();
      }
    });

    // Vérifier que la connexion a réussi
    cy.url().should('include', '/dashboard');
  });
});
