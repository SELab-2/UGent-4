import { cyan } from "@mui/material/colors"

describe('add and change projects', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('create new project with restrictions', () => {

        cy.contains('test course').click()
        cy.get('#addProject').click()
        // fill in the fields
        cy.get('#projectName').type('test project')
        cy.get('.MuiInputBase-input').eq(1).type('220820242359')
        cy.get('.MuiInputBase-input').eq(2).type('290820242359')
        cy.get('#description').type('This is a test project set up by the e2e tests.')
        cy.get('#setInVisible').click()
        cy.get('#setVisible').click()
        cy.get('#groupSize').clear().type('2')
        cy.get('#maxScore').clear().type('30')
        // add an assignment
        cy.get('#uploadButton').selectFile('cypress/fixtures/test.pdf')
        cy.contains('test.pdf').should('exist')
        // add a restriction script
        cy.get('#addRestrictionButton').click()
        // create a new script
        cy.get('#newScript').click()
        cy.get('#scriptName').type('test script')
        cy.get('#extension').click()
        cy.contains('.py').click()
        cy.contains('.sh').click()
        cy.get('#scriptContent').type('#!/bin/bash\nvar="Hello World"\necho "$var"')
        cy.get('#saveScript').click()
        // confirm in popup
        cy.get('#confirm').click()
        // save assignment
        cy.get('#save').click()
        // confirm in popup
        cy.get('#confirm').click()
        // check if project was added
        cy.contains('test project').should('exist')
        cy.contains('22/08/2024 23:59').should('exist').click()
        cy.contains('This is a test project set up by the e2e tests.').should('exist')
    }) 
  
    it('change existing project', () => {

      cy.contains('test course').click()
      cy.contains('test project').click()
      cy.get('#editButton').click()
      // change some fields
      cy.get('.MuiInputBase-input').eq(2).type('270820242359')
      cy.get('#description').type(' This project has been altered.')
      // save assignment
      cy.get('#save').click()
      // confirm in popup
      cy.get('#confirm').click()
      // check if project was altered
      cy.contains('test project').should('exist')
      cy.contains('This is a test project set up by the e2e tests. This project has been altered.').should('exist')
      cy.contains('22/08/2024 23:59')
      cy.contains('27/08/2024 23:59')
    }) 
    
})