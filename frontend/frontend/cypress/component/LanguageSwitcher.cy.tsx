import { LanguageSwitcher } from "../../src/components/LanguageSwitcher";

describe('LanguageSwitcher', () => {

    it('renders', () => {
        cy.mount(<LanguageSwitcher />)
        cy.get('#en').should('exist').should('have.text', 'en');
        cy.get('#nl').should('exist').should('have.text', 'nl');
    });

})