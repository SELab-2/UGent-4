import { AddChangeSubjectPage } from '../../../src/pages/subjectsPage/AddChangeSubjectPage'
import { BrowserRouter } from 'react-router-dom'

// This page fetches data from the backend.
// So as far as the component test is concerned,
// we can only show what shows up before the fetch.
// This is why only the loading animation is checked.
// The rest of the tests are in the integration tests.
describe('AddChangeSubjectsPage', () => {
    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <AddChangeSubjectPage />
            </BrowserRouter>
        )
        cy.get('[data-cy=loadingAnimation]').should('exist')
    })
})
