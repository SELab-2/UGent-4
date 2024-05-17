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
        cy.get('#popUpTitle').should('exist').should('have.text', fixtures.title);
        cy.get('#popUpText').should('exist').should('have.text', fixtures.warning);
        cy.get('#cancelButton').should('exist');
        cy.get('#actionButton').should('exist').should('have.text', fixtures.button);
    });

    it('renders closed', () => {
        mockProps.open = false;
        cy.mount(<WarningPopup {...mockProps} />);
        cy.get('#popUpTitle').should('not.exist');
        cy.get('#popUpText').should('not.exist');
        cy.get('#cancelButton').should('not.exist');
        cy.get('#actionButton').should('not.exist');
    });
});