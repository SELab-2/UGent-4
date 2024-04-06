import { ItemList } from '../../src/components/ItemList';
import fixtures from '../fixtures/fixtures.json';

describe('ItemList', () => {
    const mockProps = {
        itemList: fixtures.itemList,
    };

    it('renders', () => {
        cy.mount(<ItemList {...mockProps} />);
        cy.get('.MuiPaper-root').should('exist');
        cy.get('.MuiTable-root').should('exist');
        cy.get('.MuiTableHead-root').should('exist');
        cy.get('.MuiTableBody-root').should('exist');
        cy.get('.MuiTableCell-root').should('exist');
        cy.get('.MuiTableRow-root').should('exist');

        for (let i = 0; i < fixtures.itemList.length; i++) {
            cy.contains(fixtures.itemList[i].opdracht).should('exist');
            cy.contains(fixtures.itemList[i].deadline).should('exist');
            cy.contains(fixtures.itemList[i].status).should('exist');
            cy.contains(fixtures.itemList[i].score).should('exist');
        }
    });
});