describe('submit files for an assignment', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('submit', () => {

        cy.get('#test course').click()
        cy.get('#test project').click()

        // TODO submit files
    }) 
})