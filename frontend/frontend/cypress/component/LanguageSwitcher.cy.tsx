import { LanguageSwitcher } from "../../src/components/LanguageSwitcher";

describe('LanguageSwitcher', () => {

    it('renders', () => {
        cy.mount(<LanguageSwitcher />)
        cy.get('li').each(($li) => {
            expect($li.text()).to.match(/en|nl/);
        });
    });

})