describe('archive projects and courses', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('archive project', () => {

        cy.contains('test course').click()
        cy.get('#archive').click()
        cy.get('#confirm').click()
        // check if the project is archived
        cy.contains('Archived').click()
        cy.contains('test project').should('exist')
    }) 

    it('archive course', () => {

        cy.get('#archiveButton').first().click()
        cy.get('#confirm').click()
        // check if the course is archived
        cy.contains('Archived').click()
        cy.contains('test course').should('exist')
      }) 
  

})