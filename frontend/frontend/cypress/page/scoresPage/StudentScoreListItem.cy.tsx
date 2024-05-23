import { StudentScoreListItem } from '../../../src/pages/scoresPage/StudentScoreListItem'
import fixtures from '../../fixtures/fixtures.json'

// This page fetches data from the backend.
// So as far as the component test is concerned,
// we can only show what shows up before the fetch.
// This is why only the loading animation is checked.
// The rest of the tests are in the integration tests.
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
        cy.get('[data-cy=loadingAnimation]').should('exist')
    })
})