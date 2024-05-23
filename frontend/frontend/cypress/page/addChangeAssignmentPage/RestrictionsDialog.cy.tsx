import RestrictionsDialog from '../../../src/pages/addChangeAssignmentPage/RestrictionsDialog'
import { BrowserRouter } from 'react-router-dom'

describe('RestrictionsDialog', () => {
    const mockProps = {
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
        cy.get('#upload').should('exist')
        cy.get('#newScript').should('exist')
        cy.get('#fileExtensionCheck').should('exist')
        cy.get('#filesPresentCheck').should('exist')
        cy.get('#mustPassSwitch').should('exist').click()
    })
})
