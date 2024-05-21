describe('student chooses a group and leaves', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('choose', () => {
        cy.get('#test course').click()
        cy.get('#test project').click()
        
        // TODO 
    }) 

    it('leave', () => {
        cy.get('#test course').click()
        cy.get('#test project').click()
  
        // TODO 
    })
})