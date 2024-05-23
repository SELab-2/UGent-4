import { StudentScoreListItem } from '../../../src/pages/scoresPage/StudentScoreListItem'
import fixtures from '../../fixtures/fixtures.json'

describe('StudentScoreListItem', () => {
    const mockProps = {
        key: fixtures.id,
        groupNumber: fixtures.id,
        studenten: fixtures.studenten,
        lastSubmission: undefined,
        score: fixtures.score,
        maxScore: fixtures.maxScore,
        changeScore: () => {},
    }

    it('renders', () => {
        cy.mount(<StudentScoreListItem {...mockProps} />)
        // The student needs to be fetched from the backend, so we can't check the name
        cy.get(`#group${mockProps.groupNumber}`).should('exist')
        cy.get('#noScore')
            .should('exist')
            .should('contain', '0/' + mockProps.maxScore)
        cy.get('#downloadSubmissionButton').should('exist')
    })
})
