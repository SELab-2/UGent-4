describe('add students to groups or let them choose', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173')
    })
  
    it('add', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#groups').click()
        cy.get('#randomGroups').click()
        cy.get('#confirm').click()
        cy.get('#saveGroups').click()
        cy.get('#confirm').click()
    })

    it('choose', () => {
        cy.contains('test course').click()
        cy.contains('test project').click()
        cy.get('#groups').click()
        cy.get('#studentsChoose').click()
        cy.get('#saveGroups').click()
        cy.get('#confirm').click()
    })


})