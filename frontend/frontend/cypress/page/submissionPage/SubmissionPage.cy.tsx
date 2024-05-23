import { SubmissionPage } from '../../../src/pages/submissionPage/SubmissionPage'
import { BrowserRouter } from 'react-router-dom'
import { t } from 'i18next'

describe('SubmissionPage', () => {
    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <SubmissionPage />
            </BrowserRouter>
        )
        cy.get('[data-cy=header]').should('exist')
        cy.get('[data-cy=assignmentTitle]').should('exist')
        cy.get('[data-cy=projectBeschrijving]').should('exist')
        cy.get('[data-cy=filename]').should('exist')
        cy.get('[data-cy=downloadSubmissionButton]').should('exist')
        cy.get('[data-cy=restrictionsTitle]').should('exist')
        cy.get('[data-cy=statusTitle]').should('exist')
        cy.get('[data-cy=resultTitle]').should('exist')
    })
})
