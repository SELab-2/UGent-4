escribe('add students to groups or let them choose', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('add', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()


        // TODO add students to group
    })

    it('choose', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
  
  
        // TODO let students choose a group
    })


})