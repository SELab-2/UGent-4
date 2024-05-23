import { Header } from '../../src/components/Header'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../fixtures/fixtures.json'

describe('Header', () => {
    const mockProps = {
        // variant: "not_main" | "editable" | "default";
        variant: "not_main",
        title: fixtures.title,
    };

    it('renders not main', () => {
        cy.mount(<BrowserRouter><Header {...mockProps} /></BrowserRouter>)
        cy.get('.MuiToolbar-root').should('exist');
        cy.get('[data-cy=title]').should('exist').should('have.text', fixtures.title);
        cy.get('#logo').click();
        cy.get('#editButton').should('not.exist');
        cy.get('[data-cy=backButton').trigger('mouseover');
        cy.contains('back').should('be.visible');
        cy.contains('Logout').should('be.visible');
        
    });

    it ('renders editable', () => {
        mockProps.variant = "editable";
        cy.mount(<BrowserRouter><Header {...mockProps} /></BrowserRouter>)
        cy.get('.MuiToolbar-root').should('exist');
        cy.get('[data-cy=title]').should('exist').should('have.text', fixtures.title);
        cy.get('#logo').click();
        cy.get('#editButton').should('exist');
        cy.get('[data-cy=backButton').trigger('mouseover');
        cy.contains('back').should('be.visible');
        cy.contains('Logout').should('be.visible');
    });

    it ('renders default', () => {
        mockProps.variant = "default";
        cy.mount(<BrowserRouter><Header {...mockProps} /></BrowserRouter>)
        cy.get('.MuiToolbar-root').should('exist');
        cy.get('[data-cy=title]').should('exist').should('have.text', fixtures.title);
        cy.get('#logo').click();
        cy.get('#editButton').should('not.exist');
        cy.contains('Logout').should('be.visible');
    });
})