import {AssignmentPage} from '../../../src/pages/assignmentPage/AssignmentPage'; // Check if the file path is correct and if the required module exists in the specified location.
import {BrowserRouter} from 'react-router-dom';
import fixtures from '../../fixtures/fixtures.json';

describe('AssignmentPage', () => {

    it('renders', () => {
        cy.mount(<BrowserRouter><AssignmentPage/></BrowserRouter>);
        // this renders for a student, teacher will be tested in e2e tests
        cy.get('#logo').should('exist');
        cy.get('#userMenu').should('exist');

        cy.contains('Deadline: no deadline');
        cy.contains('Status');
        cy.contains('Confirm Upload');
        cy.get('#uploadButton').should('exist');
    });
});