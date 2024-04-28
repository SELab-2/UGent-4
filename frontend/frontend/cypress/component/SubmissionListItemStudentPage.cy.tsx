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
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemButton-root').should('exist');

        cy.get('.MuiListItemText-root').should('exist').should('have.text', mockProps.id + mockProps.timestamp);
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
        cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
    });

    it('renders incorrect submission', () => {
        mockProps.status = false;
        cy.mount(<BrowserRouter><SubmissionListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemButton-root').should('exist');

        cy.get('.MuiListItemText-root').should('exist').should('have.text', mockProps.id + mockProps.timestamp);
        cy.get('[data-testid="HighlightOffIcon"]').should('exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('not.exist');
    });
});