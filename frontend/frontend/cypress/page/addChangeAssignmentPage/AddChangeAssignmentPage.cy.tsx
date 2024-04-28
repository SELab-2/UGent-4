import {AddChangeAssignmentPage} from '../../../src/pages/addChangeAssignmentPage/AddChangeAssignmentPage'; // Check if the file path is correct and if the required module exists in the specified location.
import {BrowserRouter} from 'react-router-dom';
import fixtures from '../../fixtures/fixtures.json';

describe('AddChangeAssignmentPage', () => {

    it('renders assignment name', () => {
        cy.mount(<BrowserRouter><AddChangeAssignmentPage/></BrowserRouter>);
        // check if the header is rendered
        cy.get('#logo').should('exist');
        cy.get('#userMenu').should('exist');
        // title field
        cy.get('#titleField').should('have.attr', 'placeholder', 'Title');
        cy.get('#titleField').type('New title');
        cy.get('#titleField').should('have.value', 'New title');
        cy.get('#uploadButton').should('exist');
        // deadline field
        cy.get('#deadline').should('have.text', 'Deadline:');
        cy.get('#deadlineField').should('have.attr', 'placeholder', 'DD/MM/YYYY hh:mm');
        cy.get('#deadlineField').type('311220252359');
        cy.get('#deadlineField').should('have.value', '31/12/2025 23:59');
        // extra deadline field
        cy.get('#extraDeadline').should('have.text', 'Extra Deadline:');
        cy.get('#extraDeadlineField').should('have.attr', 'placeholder', 'DD/MM/YYYY hh:mm');
        cy.get('#extraDeadlineField').type('311220262359');
        cy.get('#extraDeadlineField').should('have.value', '31/12/2026 23:59');
        //description field
        cy.get('#descriptionField').should('have.attr', 'placeholder', 'Description');
        cy.get('#descriptionField').type('New description');
        cy.get('#descriptionField').should('have.value', 'New description');
        // restrictions field
        cy.get('#addRestrictionButton').should('exist').click();
        cy.get('#upload').should('exist');
        cy.get('#newScript').should('exist');
        cy.get('#fileExtensionCheck').should('exist');
        cy.get('#filesPresentCheck').should('exist');
        cy.get('#mustPassSwitch').should('exist');
        cy.get('#cancelButton').should('exist').click();
        // max score field
        cy.get('#maxScore').should('have.text', 'Max Score:');
        cy.get('#maxScoreField').should('have.value', '20');
        cy.get('#maxScoreField').clear().type('30');
        cy.get('#maxScoreField').should('have.value', '30');
        // all buttons
        cy.get('#visibilityOff').should('exist').click();
        cy.get('#visibilityOn').should('exist').click();
        cy.get('#cancel').should('exist').click();
        // these have popups
        cy.get('#submit').should('exist').click();
        cy.get('#cancelButton').should('exist').click();
        cy.get('#delete').should('exist').click();
        cy.get('#actionButton').should('exist').click();

    });

});