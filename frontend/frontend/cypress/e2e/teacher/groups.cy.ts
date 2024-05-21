escribe('add students to groups or let them choose', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('add', () => {

        cy.get('#test course').click()
        cy.get('#test project').click()


        // TODO add students to group
    })

    it('choose', () => {

        cy.get('#test course').click()
        cy.get('#test project').click()
  
  
        // TODO let students choose a group
    })


})