describe('create a course', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('create new course', () => {

      cy.get('#addCourse').click()
      // fill in the fields
      cy.get('#courseName').type('test course')
      cy.get('#uploadStudent').get('#email').type('student@testing.com')
      cy.get('#uploadStudent').get('#add').click()
      cy.get('#save').click()

      // check if course was added
    }) 
})