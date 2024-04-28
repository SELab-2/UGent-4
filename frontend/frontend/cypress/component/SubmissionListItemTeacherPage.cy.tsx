import { SubmissionListItemTeacherPage } from '../../src/components/SubmissionListItemTeacherPage';
import { BrowserRouter } from 'react-router-dom';

describe('SubmissionListItemTeacherPage', () => {
    const mockProps = {
        group_id: 1,
        assignment_id: 1,
        course_id: 1,
    };

    it('renders correct submission', () => {
        // The data needs to be fetched from the backend, so we can't check that
        cy.mount(<BrowserRouter><SubmissionListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('#submission' + mockProps.group_id).should('exist');
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('#submissionId').should('exist').should('have.text', mockProps.group_id);
        cy.get('#submissionTimestamp').should('exist');
        cy.get('#submissionScore').should('exist');
        cy.get('#check').should('not.exist');
        cy.get('#cross').should('not.exist');
        cy.get('#downloadIconGray').should('exist');
        cy.get('#downloadIconColor').should('not.exist');
    });
});