import {AddChangeAssignmentPage} from '../../../src/pages/addChangeAssignmentPage/AddChangeAssignmentPage'; // Check if the file path is correct and if the required module exists in the specified location.
import {BrowserRouter} from 'react-router-dom';
import fixtures from '../../fixtures/fixtures.json';

describe('AddChangeAssignmentPage', () => {

    it('renders assignment name', () => {
        cy.mount(<BrowserRouter><AddChangeAssignmentPage/></BrowserRouter>);
        // Alle elementen die in de AddChangeAssignmentPage component zitten worden direct na elkaar gezet
        cy.get('.MuiTypography-root').should('exist').should('have.text', 'Deadline:Extra Deadline:Max Score');
        cy.get('.MuiTextField-root').should('exist').should('have.length', 5);
        cy.get('.MuiButton-root').should('exist');
    });

});