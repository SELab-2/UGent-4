import Button from '@mui/material/Button';

describe('Button', () => {
  beforeEach(() => {
    cy.mount(<Button>Click me</Button>);
  });

  it('renders without crashing', () => {
    cy.get('button').should('exist').should('have.text', 'Click me');
  });

});