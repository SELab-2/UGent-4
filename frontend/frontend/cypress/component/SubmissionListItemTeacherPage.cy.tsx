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
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist');
        cy.get('[data-testid="DownloadIcon"]');
    });
});