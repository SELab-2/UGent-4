import { GroupListItem } from '../../src/components/GroupListItem';
import { BrowserRouter } from 'react-router-dom';
import fixtures from '../fixtures/fixtures.json';

describe('GroupListItem', () => {
    const mockProps = {
        id: fixtures.id,
        name: fixtures.name,
        groupMemberNames: fixtures.groupMemberNames,
    };

    it('renders', () => {
        cy.mount(<BrowserRouter><GroupListItem {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', '');
        cy.get('.MuiInputBase-root').click();
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.groupMemberNames.join(", "));
    });
});