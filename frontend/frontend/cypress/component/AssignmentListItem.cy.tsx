import { AssignmentListItem } from '../../src/components/AssignmentListItem'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../fixtures/fixtures.json'

describe('AssignmentListItem', () => {
    const mockProps = {
        id: fixtures.id,
        projectName: fixtures.project,
        dueDate: new Date().toLocaleDateString(),
        status: false,
        isStudent: true,
    }

    it('renders with cross', () => {
        cy.mount(
            <BrowserRouter>
                <AssignmentListItem {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiListItem-root').should('exist')
        cy.get('#project' + fixtures.id).should('exist')
        cy.get('#projectName').should('contain.text', fixtures.project)
        cy.get('#dueDate').should(
            'contain.text',
            new Date().toLocaleDateString()
        )
        cy.get('#cross').should('exist')
        cy.get('#check').should('not.exist')
    })

    it('renders with checkmark', () => {
        mockProps.status = true
        cy.mount(
            <BrowserRouter>
                <AssignmentListItem {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiListItem-root').should('exist')
        cy.get('#project' + fixtures.id).should('exist')
        cy.get('#projectName').should('contain.text', fixtures.project)
        cy.get('#dueDate').should(
            'contain.text',
            new Date().toLocaleDateString()
        )
        cy.get('#cross').should('not.exist')
        cy.get('#check').should('exist')
    })

    it('renders with no due date', () => {
        mockProps.dueDate = undefined
        cy.mount(
            <BrowserRouter>
                <AssignmentListItem {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiListItem-root').should('exist')
        cy.get('#project' + fixtures.id).should('exist')
        cy.get('#projectName').should('contain.text', fixtures.project)
        // normaal zou hier 'no deadline' moeten staan in de correcte taal, maar blijkbaar gaat dat niet in de testen
        // omdat er hier niet echt een taal is ingesteld?
        cy.get('#dueDate').should(
            'not.contain.text',
            new Date().toLocaleDateString()
        )
        cy.get('#cross').should('not.exist')
        cy.get('#check').should('exist')
    })

    it('renders as teacher', () => {
        mockProps.isStudent = false
        mockProps.dueDate = new Date().toLocaleDateString()
        cy.mount(
            <BrowserRouter>
                <AssignmentListItem {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiListItem-root').should('exist')
        cy.get('#project' + fixtures.id).should('exist')
        cy.get('#projectName').should('contain.text', fixtures.project)
        cy.get('#dueDate').should(
            'contain.text',
            new Date().toLocaleDateString()
        )
        cy.get('#cross').should('not.exist')
        cy.get('#check').should('not.exist')
    })
})
