import MainPage from '../../../src/pages/mainPage/MainPage';
import {BrowserRouter} from 'react-router-dom';

describe('Main Page', () => {

    it('renders the main page basics', () => {
        //TODO: Om de een of andere reden krijgt cypress hier type errors
        // los die op.
        cy.mount(<BrowserRouter><MainPage /></BrowserRouter>);
        // In de linkerbovenhoek staat het logo van de UGent
        //cy.get('img').should('exist');
        //cy.get('div').should('exist').should('have.txt', "Pigeonhole");
    });

});