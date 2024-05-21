describe('student chooses a group and leaves', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('choose', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        
        // TODO 
    }) 

    it('leave', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
  
        // TODO 
    })
})