import { SubmissionPage } from '../../../src/pages/submissionPage/SubmissionPage'
import { BrowserRouter } from 'react-router-dom'

describe('SubmissionPage', () => {
    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <SubmissionPage />
            </BrowserRouter>
        )
        cy.get('#logo').should('exist')
        cy.get('#title').should('exist')
        cy.get('#userMenu').should('exist')
        cy.get('#backButton').should('exist')
        cy.get('#deadline').should('exist')
        cy.get('#description').should('exist')
        cy.get('#downloadButton').should('exist')
    })
})
