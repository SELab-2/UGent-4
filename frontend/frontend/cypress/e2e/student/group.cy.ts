describe('student chooses a group and leaves', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })

    it('leave', () => {
        // student should be in a group because of the teacher groups test
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#group').click()
        cy.contains('Student Testing').should('exist')
        cy.get('#leaveGroup').click()
    })
  
    it('join', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#group').click()
        cy.contains('No members yet').should('exist')
        cy.get('#joinGroup').click()
    }) 

})