import { AssignmentListItemStudentPage } from '../../src/components/AssignmentListItemStudentPage';
import { BrowserRouter } from 'react-router-dom';

describe('AssignmentListItemStudentPage', () => {
    const mockProps = {
        id: '1',
        studentName: 'Test Name',
        dueDate: new Date(),
        status: false,
    };

    it('renders with checkmark', () => {
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Name' + new Date().toLocaleDateString());
        cy.get('[data-testid="HighlightOffIcon"]').should('exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('not.exist');
    });

    it('renders with cross', () => {
        mockProps.status = true;
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Name' + new Date().toLocaleDateString());
        cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
    });

    it('renders with no due date', () => {
        mockProps.dueDate = undefined;
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Name');
        cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
    });
});