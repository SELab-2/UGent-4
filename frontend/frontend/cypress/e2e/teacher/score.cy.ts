describe('assign scores to submissions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('assign scores', () => {

      cy.get('#test course').click()
      cy.get('#test project').click()
      cy.get('#adjustScores').click()

      // TODO adjust the scores
    }) 
})