describe('example to-do app', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/course/1')
      cy.task('db:seed')
        cy.loginByAuth0Api(
          Cypress.env('auth0_username'),
          Cypress.env('auth0_password')
        )
    })
  
    it('has a tab switcher for active and archived courses', () => {
      cy.get('[data-cy=tab-switcher]')
    
    })
  
  })
  