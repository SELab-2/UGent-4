import { ArchivedView } from '../../../src/pages/mainPage/ArchivedView';
import {BrowserRouter} from 'react-router-dom';

describe('ArchivedView', () => {

    const mockProps = {
        isStudent: false,
        activecourses: []
      };

    it('renders the ArchivedView', () => {
        cy.mount(<BrowserRouter><ArchivedView {...mockProps} /></BrowserRouter>);
        // Op deze pagina staat er voorloop letterlijk geen enkele gegarandeerde component,
        // dus we testen of er een div bestaat.
        //TODO: om de een of andere reden geeft cypress hier een type error, los die op.
        cy.get('div').should('exist');
    });

});