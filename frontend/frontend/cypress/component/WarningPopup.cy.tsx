import WarningPopup from '../../src/components/WarningPopup';
import fixtures from '../fixtures/fixtures.json';

describe('WarningPopup', () => {
    const mockProps = {
        title: fixtures.title,
        content: fixtures.warning,
        buttonName: fixtures.button,
        open: true,
        handleClose: () => {},
        doAction: () => {},
    };

    it('renders', () => {
        cy.mount(<WarningPopup {...mockProps} />);
        // cancel not visible because of internationlization
        cy.contains(fixtures.title).should('exist');
        cy.contains(fixtures.warning).should('exist');
        cy.get('.MuiButton-root').should('exist').should('have.text', fixtures.button);
    });

    it('renders closed', () => {
        mockProps.open = false;
        cy.mount(<WarningPopup {...mockProps} />);
        cy.contains(fixtures.title).should('not.exist');
        cy.contains(fixtures.warning).should('not.exist');
        cy.get('.MuiButton-root').should('not.exist');
    });
});