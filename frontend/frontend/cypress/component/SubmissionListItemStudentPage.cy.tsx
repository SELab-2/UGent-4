import { SubmissionListItemStudentPage } from '../../src/components/SubmissionListItemStudentPage';
import { BrowserRouter } from 'react-router-dom';

describe('SubmissionListItemStudentPage', () => {
    const mockProps = {
        id: 1,
        timestamp: new Date().toLocaleString(),
        status: true,
        assignment_id: 1,
        course_id: 1,
    };

    it('renders correct submission', () => {
        cy.mount(<BrowserRouter><SubmissionListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('#submission' + mockProps.id).should('exist');
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('#submissionId').should('exist').should('have.text', mockProps.id);
        cy.get('#submissionTimestamp').should('exist').should('have.text', mockProps.timestamp);
        cy.get('#check').should('exist');
        cy.get('#cross').should('not.exist');
    });

    it('renders incorrect submission', () => {
        mockProps.status = false;
        cy.mount(<BrowserRouter><SubmissionListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('#submission' + mockProps.id).should('exist');
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('#submissionId').should('exist').should('have.text', mockProps.id);
        cy.get('#submissionTimestamp').should('exist').should('have.text', mockProps.timestamp);
        cy.get('#check').should('not.exist');
        cy.get('#cross').should('exist');
    });

});