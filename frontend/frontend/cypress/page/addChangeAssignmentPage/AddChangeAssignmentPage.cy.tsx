import { AddChangeAssignmentPage } from '../../../src/pages/addChangeAssignmentPage/AddChangeAssignmentPage' // Check if the file path is correct and if the required module exists in the specified location.
import { BrowserRouter } from 'react-router-dom'

// This page fetches data from the backend.
// So as far as the component test is concerned,
// we can only show what shows up before the fetch.
// This is why only the loading animation is checked.
// The rest of the tests are in the integration tests.
describe('AddChangeAssignmentPage', () => {
    it('renders assignment name', () => {
        cy.mount(
            <BrowserRouter>
                <AddChangeAssignmentPage />
            </BrowserRouter>
        )
        cy.get('[data-cy=loadingAnimation]').should('exist')
    })
})
