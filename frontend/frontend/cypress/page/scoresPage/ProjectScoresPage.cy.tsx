import { ProjectScoresPage } from '../../../src/pages/scoresPage/ProjectScoresPage'
import { BrowserRouter } from 'react-router-dom'

describe('ProjectScoresPage', () => {
    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <ProjectScoresPage />
            </BrowserRouter>
        )
        cy.get('#logo').should('exist')
        cy.get('#userMenu').should('exist')
        cy.contains('Scores')
        cy.get('#exportSubmissionsButton').should('exist')
        cy.get('#uploadScoresButton').should('exist')
        cy.get('#saveScoresButton').should('exist')
        cy.get('#deleteScoresButton').should('exist')
    })
})
