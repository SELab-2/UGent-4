import AddRestrictionButton from '../../../src/pages/addChangeAssignmentPage/AddRestrictionButton'
import { BrowserRouter } from 'react-router-dom'

describe('AddRestrictionsButton', () => {
    const mockProps = {
        restrictions: [],
        setRestrictions: () => {},
    }

    it('renders the restrictions add button', () => {
        cy.mount(
            <BrowserRouter>
                <AddRestrictionButton {...mockProps} />
            </BrowserRouter>
        )
        cy.get('#addRestrictionButton').should('exist').click()
        cy.get('#upload').should('exist')
        cy.get('#newScript').should('exist')
        cy.get('#cancelButton').should('exist').click()
    })
})
