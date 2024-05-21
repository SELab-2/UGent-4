describe('create a course', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('create new course', () => {

      cy.get('#addCourse').click()
    }) 
})