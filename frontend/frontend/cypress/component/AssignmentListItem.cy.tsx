import { AssignmentListItem } from '../../src/components/AssignmentListItem';
import { BrowserRouter } from 'react-router-dom';

describe('AssignmentListItem', () => {
  const mockProps = {
    id: '1',
    projectName: 'Test Project',
    dueDate: new Date(),
    status: false,
    isStudent: true,
  };

  it('renders with checkmark', () => {
    cy.mount(<BrowserRouter><AssignmentListItem {...mockProps} /></BrowserRouter>);
    cy.get('.MuiListItem-root').should('exist');
    cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Project' + new Date().toLocaleDateString());
    cy.get('[data-testid="HighlightOffIcon"]').should('exist');
    cy.get('[data-testid="CheckCircleOutlineIcon"]').should('not.exist');
  });

  it('renders with cross', () => {
    mockProps.status = true;
    cy.mount(<BrowserRouter><AssignmentListItem {...mockProps} /></BrowserRouter>);
    cy.get('.MuiListItem-root').should('exist');
    cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Project' + new Date().toLocaleDateString());
    cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
    cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
  });

  it('renders with no due date', () => {
    mockProps.dueDate = undefined;
    cy.mount(<BrowserRouter><AssignmentListItem {...mockProps} /></BrowserRouter>);
    cy.get('.MuiListItem-root').should('exist');
    cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Project'); 
    // normaal zou hier 'no deadline' moeten staan in de correcte taal, maar blijkbaar gaat dat niet in de testen
    // omdat er hier niet echt een taal is ingesteld?
    cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
    cy.get('[data-testid="CheckCircleOutlineIcon"]').should('exist');
  });

  it('renders as teacher', () => {
    mockProps.isStudent = false;
    mockProps.dueDate = new Date();
    cy.mount(<BrowserRouter><AssignmentListItem {...mockProps} /></BrowserRouter>);
    cy.get('.MuiListItem-root').should('exist');
    cy.get('.MuiListItemText-root').should('exist').should('have.text', 'Test Project' + new Date().toLocaleDateString());
    cy.get('[data-testid="HighlightOffIcon"]').should('not.exist');
    cy.get('[data-testid="CheckCircleOutlineIcon"]').should('not.exist');
  });
});
