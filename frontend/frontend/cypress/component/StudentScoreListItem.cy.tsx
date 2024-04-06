import { StudentScoreListItem } from '../../src/components/StudentScoreListItem';
import fixtures from '../fixtures/fixtures.json';

describe('StudentScoreListItem', () => {
    const mockProps = {
        key: fixtures.id,
        groepName: fixtures.name,
        submissionFiles: [],
        startScore: fixtures.score,
        maxScore: fixtures.maxScore,
    };

    it('renders', () => {
        cy.mount(<StudentScoreListItem {...mockProps} />);
        cy.get(`.MuiListItemText-root:contains("${fixtures.name}")`).should('exist');
        cy.get('.MuiInputBase-input').should('have.value', fixtures.score);
        cy.get('.MuiInputBase-input').clear();
        cy.get('.MuiInputBase-input').should('have.value', '');
        cy.get('.MuiInputBase-root').click().type(fixtures.score);
        cy.get('.MuiInputBase-input').should('have.value', fixtures.score);
        cy.get('.MuiListItemText-root:contains("/")').should('exist');
        cy.get(`.MuiListItemText-root:contains("${fixtures.maxScore}")`).should('exist');
        cy.get('[data-testid="DownloadIcon"]').click();
    });
});