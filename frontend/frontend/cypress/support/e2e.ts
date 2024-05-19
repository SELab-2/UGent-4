// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

function loginViaAAD(username: string, password: string) {
    cy.visit('https://sel2-4.ugent.be/')
    cy.get('button').click()
  
    // Login to your AAD tenant.
    cy.origin(
      'login.microsoftonline.com',
      {
        args: {
          username,
          password,
        },
      },
      ({ username, password }) => {
        cy.get('input[type="email"]').type(username, {
          log: false,
        })
        cy.get('input[type="submit"]').click()
        cy.get('input[type="password"]').type(password, {
            log: false,
        })
        cy.get('input[type="submit"]').click()
      }
    )
  
    // Ensure Microsoft has redirected us back to the sample app with our logged in user.
    cy.url().should('equal', 'https://sel2-4.ugent.be/')
    cy.get('#welcome-div').should(
      'contain',
      `Welcome ${Cypress.env('aad_username')}!`
    )
  }
  
  Cypress.Commands.add('loginToAAD', (username: string, password: string) => {
    cy.session(
      `aad-${username}`,
      () => {
        const log = Cypress.log({
          displayName: 'Azure Active Directory Login',
          message: [`🔐 Authenticating | ${username}`],
          // @ts-ignore
          autoEnd: false,
        })
  
        log.snapshot('before')
  
        loginViaAAD(username, password)
  
        log.snapshot('after')
        log.end()
      },
      {
        validate: () => {
          // this is a very basic form of session validation for this demo.
          // depending on your needs, something more verbose might be needed
          cy.visit('https://sel2-4.ugent.be/')
          cy.contains('Pigeonhole').should('exist')
        },
      }
    )
  })