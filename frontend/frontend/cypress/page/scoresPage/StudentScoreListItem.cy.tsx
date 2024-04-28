import { StudentScoreListItem } from '../../../src/pages/scoresPage/StudentScoreListItem';
import fixtures from '../../fixtures/fixtures.json';

describe('StudentScoreListItem', () => {
    const mockProps = {
        key: fixtures.id,
        groupNumber: fixtures.id,
        studenten: fixtures.studenten,
        lastSubmission: undefined,
        score: fixtures.score,
        maxScore: fixtures.maxScore,
        changeScore: () => {},
    };

    it('renders', () => {
        cy.mount(<StudentScoreListItem {...mockProps} />);
        // The student needs to be fetched from the backend, so we can't check the name
        cy.get(`.MuiListItemText-root:contains("undefined")`).should('exist');
        cy.get('.MuiListItemText-root:contains("/")').should('exist');
        cy.get(`.MuiListItemText-root:contains("${fixtures.maxScore}")`).should('exist');
        cy.get('[data-testid="DownloadIcon"]');
    });
});