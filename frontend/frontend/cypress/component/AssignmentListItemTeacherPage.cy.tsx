import { AssignmentListItemTeacherPage } from '../../src/components/AssignmentListItemTeacherPage';
import { BrowserRouter } from 'react-router-dom';
import fixtures from '../fixtures/fixtures.json';

describe('AssignmentListItemTeacherPage', () => {
    const mockProps = {
        id: fixtures.id,
        studentName: fixtures.name,
        submitted: new Date(),
        score: fixtures.score,
    };

    it('renders', () => {
        cy.mount(<BrowserRouter><AssignmentListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.name + new Date().toLocaleDateString() + mockProps.score + '/20');
        // TODO check if download button exists
    });

    it('renders with no submission', () => {
        mockProps.submitted = undefined;
        cy.mount(<BrowserRouter><AssignmentListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.name + '-');
    });
});