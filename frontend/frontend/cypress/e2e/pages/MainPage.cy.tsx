//import { MainPage } from '../../../src/pages/mainPage/MainPage';

describe('mainpage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
      cy.task('db:seed')
      cy.loginByAuth0Api(
        Cypress.env('auth0_username'),
        Cypress.env('auth0_password')
      )
    })
  
    it('displays two todo items by default', () => {
      cy.get('div').should('exist')

    })

    beforeEach(function () {
        
      })
    
      it('shows onboarding', function () {
        cy.contains('Get Started').should('be.visible')
      })

})
  