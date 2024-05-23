describe('SubjectsPage', () => {
    it('renders the SubjectsPage', () => {
        // Mount the SubjectsPage component within a BrowserRouter
        cy.mount(`<BrowserRouter><SubjectsPage /></BrowserRouter>`)

        // You may want to add assertions here to verify the rendered output
        // For example, check if certain elements exist in the rendered output
        // cy.get('button').should('exist');
        // cy.get('ul').should('exist');
    })
})
