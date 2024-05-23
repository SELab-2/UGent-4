import { GroupAccessComponent } from '../../src/components/GroupAccessComponent'
import { BrowserRouter } from 'react-router-dom'

describe('GroupAccessComponent', () => {
    const mockProps = {
        assignmentid: 1,
        courseid: 1,
    }

    it('toggles group access', () => {
        cy.mount(
            <BrowserRouter>
                <GroupAccessComponent {...mockProps} />
            </BrowserRouter>
        )
        cy.get('[data-cy=groupButton]').should('exist')
    })
})
