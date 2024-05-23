describe('test', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Logout').should('be.visible');
  })
})