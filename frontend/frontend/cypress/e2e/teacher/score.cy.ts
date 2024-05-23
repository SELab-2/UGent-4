describe('assign scores to submissions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('assign scores', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#adjustScores').click()
        cy.get('#score').type('10')
        cy.get('#saveScores').click()
        cy.get('#confirm').click()
        // check if the score is assigned
        cy.contains('10/30').should('exist')
    }) 
})