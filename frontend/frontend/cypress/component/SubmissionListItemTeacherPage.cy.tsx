import { SubmissionListItemTeacherPage } from '../../src/components/SubmissionListItemTeacherPage';
import { BrowserRouter } from 'react-router-dom';

describe('SubmissionListItemTeacherPage', () => {
    const mockProps = {
        group_name: 'group1',
        group_id: 1,
        assignment_id: 1,
        course_id: 1,
    };

    it('renders correct submission', () => {
        // The data needs to be fetched from the backend, so we can't check that
        cy.mount(<BrowserRouter><SubmissionListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItemButton-root').should('exist');
        cy.get('[data-cy=submissionTimestamp]').should('exist');
        cy.get('[data-cy=groupName').should('exist').should('have.text', mockProps.group_name);
        cy.get('[data-cy=submissionScore]').should('exist');
        cy.get('[data-cy=statusIcon]').should('exist');
        cy.get('[data-cy=check]').should('not.exist');
        cy.get('[data-cy=cross]').should('exist');
        cy.get('[data-cy=downloadIconGray]').should('exist');
        cy.get('[data-cy=downloadIconColor]').should('not.exist');
    });
});