describe('assign scores to submissions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('assign scores', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#adjustScores').click()

        // TODO adjust the scores
    }) 
})