describe('create and change a course', () => {
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
      cy.get('#logo').click();
      cy.contains('test course').should('exist')
      cy.contains('Students: 1').should('exist')
    })

    it('alter course', () => {

      cy.contains('test course').click()
      cy.get('#editButton').click()
      // add a student
      cy.get('#uploadStudent').get('#email').type('student1@testing.com') // make sure there is a student 1 in the db
      cy.get('#uploadStudent').get('#add').click()
      // save course
      cy.get('#save').click()
      // check if the student was added
      cy.get('#logo').click();
      cy.contains('Students: 2').should('exist')
    }) 
})