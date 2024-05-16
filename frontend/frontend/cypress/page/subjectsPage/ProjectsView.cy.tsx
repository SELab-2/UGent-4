import { ProjectsView } from '../../../src/pages/subjectsPage/ProjectsView';
import { BrowserRouter } from 'react-router-dom';
import fixtures from '../../fixtures/fixtures';

describe('ProjectsView', () => {

    const mockProps = {
        gebruiker: fixtures.gebruiker,
        archived: false,
        assignments: fixtures.projects,
        deleteAssignment: () => {},
        archiveAssignment: () => {},
        changeVisibilityAssignment: () => {},
        courseId: '1',
    }

    it('renders', () => {
        cy.mount(<BrowserRouter><ProjectsView {...mockProps}/></BrowserRouter>);
        for (const assignment of mockProps.assignments) {
            cy.get('#' + assignment.titel.replace(/\s/g, '')).contains(assignment.titel);
            // dit is een assignmentListItem en wordt in een andere test al getest
        }
    });
});