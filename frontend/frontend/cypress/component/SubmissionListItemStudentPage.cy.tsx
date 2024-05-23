import { SubmissionListItemStudentPage } from '../../src/components/SubmissionListItemStudentPage';
import { BrowserRouter } from 'react-router-dom';

describe('SubmissionListItemStudentPage', () => {
    const mockProps = {
        realId: "1",
        visualId: "Logisch programmeren - Opdracht 1",
        timestamp: new Date().toLocaleString(),
        status: true,
        assignment_id: 1,
        course_id: 1,
    };

    it('renders correct submission', () => {
        cy.mount(<BrowserRouter><SubmissionListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('[data-cy=visualId]').should('exist').should('have.text', mockProps.visualId);
        cy.get('[data-cy=submissionTimestamp]').should('exist').should('have.text', mockProps.timestamp);
        cy.get('#check').should('exist');
        cy.get('#cross').should('not.exist');
    });

    it('renders incorrect submission', () => {
        mockProps.status = false;
        cy.mount(<BrowserRouter><SubmissionListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('[data-cy=visualId]').should('exist').should('have.text', mockProps.visualId);
        cy.get('[data-cy=submissionTimestamp]').should('exist').should('have.text', mockProps.timestamp);
        cy.get('#check').should('not.exist');
        cy.get('#cross').should('exist');
    });

});