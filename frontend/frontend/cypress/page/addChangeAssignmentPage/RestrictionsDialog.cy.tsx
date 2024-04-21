import RestrictionsDialog from '../../../src/pages/addChangeAssignmentPage/RestrictionsDialog';
import {BrowserRouter} from 'react-router-dom';

describe('RestrictionsDialog', () => {

    const mockProps = {
        restrictions: [],
        setRestrictions: () => {},
        closeParentDialog: () => {},
      };

    it('renders the dialog', () => {
        cy.mount(<BrowserRouter><RestrictionsDialog {...mockProps} /></BrowserRouter>);
        // Deze component bestaat eigenlijk enkel uit buttons en een input voor files
        cy.get('input').should('exist');
        cy.get('button').should('exist');
    });

});