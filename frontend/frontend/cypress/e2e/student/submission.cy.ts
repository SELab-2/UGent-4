describe('submit files for an assignment', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('submit', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()

        // TODO submit files
    }) 
})