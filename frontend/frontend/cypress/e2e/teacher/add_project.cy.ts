describe('add a project', () => {
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
        cy.get('#setVisible').click()
        cy.get('#groupSize').clear().type('2')
        cy.get('#maxScore').clear().type('30')
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
    }) 
})