import { AssignmentListItemTeacherPage } from '../../src/components/AssignmentListItemTeacherPage';
import { BrowserRouter } from 'react-router-dom';

describe('AssignmentListItemTeacherPage', () => {
    const mockProps = {
        id: '1',
        studentName: 'Test Name',
        submitted: new Date(),
        score: '10',
    };

    it('renders', () => {
        cy.mount(<BrowserRouter><AssignmentListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Name' + new Date().toLocaleDateString() + mockProps.score + '/20');
        // TODO check if download button exists
    });

    it('renders with no submission', () => {
        mockProps.submitted = undefined;
        cy.mount(<BrowserRouter><AssignmentListItemTeacherPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Name' + '-');
    });
});