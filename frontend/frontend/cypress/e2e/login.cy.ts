describe('template spec', () => {
  it('passes', () => {
    cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
  })
})