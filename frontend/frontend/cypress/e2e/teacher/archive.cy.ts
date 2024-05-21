describe('archive projects and courses', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('archive project', () => {

      cy.get('#test course').click()
      cy.get('#test project').click()


      // TODO submit files
    }) 

    it('archive course', () => {

        cy.get('#test course').click()
  
        // TODO submit files
      }) 
  

})