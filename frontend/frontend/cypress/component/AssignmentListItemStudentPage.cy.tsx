import { AssignmentListItemStudentPage } from '../../src/components/AssignmentListItemStudentPage';
import { BrowserRouter } from 'react-router-dom';
import fixtures from '../fixtures/fixtures.json';

describe('AssignmentListItemStudentPage', () => {
    const mockProps = {
        id: fixtures.id,
        studentName: fixtures.name,
        dueDate: new Date(),
        status: false,
    };

    it('renders with cross', () => {
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.name + new Date().toLocaleDateString());
        cy.get('[data-testid="HighlightOffIcon"]').should('exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('not.exist');
    });

    it('renders with checkmark', () => {
        mockProps.status = true;
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.name + new Date().toLocaleDateString());
        cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
    });

    it('renders with no due date', () => {
        mockProps.dueDate = undefined;
        cy.mount(<BrowserRouter><AssignmentListItemStudentPage {...mockProps} /></BrowserRouter>);
        cy.get('.MuiListItem-root').should('exist');
        cy.get('.MuiListItemText-root').should('exist').should('have.text', fixtures.name);
        cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
        cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
    });
});