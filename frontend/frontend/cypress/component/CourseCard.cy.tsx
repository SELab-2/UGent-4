import { CourseCard } from '../../src/components/CourseCard';
import { BrowserRouter } from 'react-router-dom';
import fixtures from '../fixtures/fixtures.json';

describe('CourseCard', () => {
    const mockProps = {
        courseId: fixtures.id,
        archived: false,
        isStudent: true,
    };

    it('renders', () => {
        cy.mount(<BrowserRouter><CourseCard {...mockProps} /></BrowserRouter>);
        // data is fetched from the backend, so we can't check that
        cy.get('.MuiCard-root').should('exist');
        cy.get('.MuiCardContent-root').should('exist');
        cy.should('have.text', 'undefined: undefined: 0ProjectDeadlineStatus');

    });
});