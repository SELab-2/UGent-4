import { CoursesView } from '../../../src/pages/mainPage/CoursesView';
import {BrowserRouter} from 'react-router-dom';

describe('CoursesView', () => {

    const mockProps = {
        isStudent: false,
        activecourses: []
      };

    it('renders the CoursesView', () => {
        cy.mount(<BrowserRouter><CoursesView {...mockProps} /></BrowserRouter>);
        // Het enige dat in deze pagina gegarandeerd is is een plus button voor de vakken.
        cy.get('button').should('exist');
    });

});