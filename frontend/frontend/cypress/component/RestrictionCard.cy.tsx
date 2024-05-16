import { RestrictionCard } from '../../src/components/RestrictionCard';

describe('RestrictionCard', () => {
    const mockProps = {
        restriction: {
            script: 'This is a test script',
        },
        restrictions: [],
        setRestrictions: () => {},
    };

    it('renders', () => {
        cy.mount(<RestrictionCard {...mockProps} />);
        cy.get('#script').should('exist').should('have.text', 'This is a test script');
        cy.get('#closeButton').should('exist').click();
    });
});