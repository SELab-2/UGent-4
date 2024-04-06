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
        // TODO fix login of zo, want data wordt opgevraagd aan api, maar moet toestemming hebben
    });
});