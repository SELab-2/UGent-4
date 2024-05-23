import { LanguageSwitcher } from "../../src/components/LanguageSwitcher";

describe('LanguageSwitcher', () => {

    it('renders', () => {
        cy.mount(<LanguageSwitcher />)
        cy.get('[data-cy=en]').should('exist').should('have.text', 'En');
        cy.get('[data-cy=nl]').should('exist').should('have.text', 'Nl');
    });

})