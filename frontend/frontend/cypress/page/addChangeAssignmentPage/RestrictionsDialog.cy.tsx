import RestrictionsDialog from '../../../src/pages/addChangeAssignmentPage/RestrictionsDialog'
import { BrowserRouter } from 'react-router-dom'

describe('RestrictionsDialog', () => {
    const mockProps = {
        userid: 1,
        restrictions: [],
        setRestrictions: () => {},
        closeParentDialog: () => {},
    }

    it('renders the dialog', () => {
        cy.mount(
            <BrowserRouter>
                <RestrictionsDialog {...mockProps} />
            </BrowserRouter>
        )
        cy.get('[data-cy=new_scripts_section]').should('exist')
        cy.get('#upload').should('exist')
        cy.get('[data-cy=uploadInput]').should('exist')
        cy.get('#newScript').should('exist')
        cy.get('[data-cy=existing_scripts_section]').should('exist')
        cy.get('#newScript').click()
        cy.get('[data-cy=closeIcon]').should('exist')
        cy.get('#scriptName').should('exist')
        cy.get('#extension').should('exist')
        cy.get('#saveTemplate').should('exist')
        cy.get('#saveScript').should('exist')
        cy.get('#scriptContent').should('exist')
    })
})
