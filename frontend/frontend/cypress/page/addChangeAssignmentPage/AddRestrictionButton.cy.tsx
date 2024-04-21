import AddRestrictionButton from '../../../src/pages/addChangeAssignmentPage/AddRestrictionButton';
import {BrowserRouter} from 'react-router-dom';

describe('AddRestrictionsButton', () => {

    const mockProps = {
        restrictions: [],
        setRestrictions: () => {}
      };

    it('renders the restrictions add button', () => {
        cy.mount(<BrowserRouter><AddRestrictionButton {...mockProps} /></BrowserRouter>);
        // niet veel interessants om te testen, enkel of de button en de dialog bestaan
        cy.get('button').should('exist');
        cy.get('path').should('exist');
    });

});