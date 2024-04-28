import { ArchivedView } from '../../../src/pages/mainPage/ArchivedView';
import {BrowserRouter} from 'react-router-dom';

describe('ArchivedView', () => {

    const mockProps = {
        isStudent: false,
        archivedCourses: [],
      };

    it('renders no archived courses', () => {
        cy.mount(<BrowserRouter><ArchivedView {...mockProps} /></BrowserRouter>);
        cy.get('div').should('exist');
        cy.contains('Project').should('not.exist');
        cy.contains('Deadline').should('not.exist');
    });

    it('renders archived courses', () => {
        mockProps.archivedCourses = [{vak_id: 1},{vak_id: 2},];
        cy.mount(<BrowserRouter><ArchivedView {...mockProps} /></BrowserRouter>);
        cy.get('div').should('exist');
        cy.contains('Project').should('exist');
        cy.contains('Deadline').should('exist');
        cy.get('.MuiPaper-root').should('have.length', mockProps.archivedCourses.length);
    });

});