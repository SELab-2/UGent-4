import TabSwitcher from "../../src/components/TabSwitcher";
import { ThemeProvider } from '@mui/system';
import theme from '../../src/Theme.ts';


describe('TabSwitcher', () => {
    const mockProps = {
        titles: ['assignment', 'students', 'groups'],
        nodes: [<div>node1</div>, <div>node2</div>, <div>node3</div>],
    };
    
    it('renders', () => {
        cy.mount(
            <ThemeProvider theme={theme}>
                    <TabSwitcher {...mockProps} />
            </ThemeProvider>
        );
        // the titles do not render because of internationalization?
        cy.contains('node1').should('exist');
        cy.contains('node2').should('not.exist');
        cy.contains('node3').should('not.exist');

        cy.get('button').eq(1).click();
        cy.contains('node1').should('not.exist');
        cy.contains('node2').should('exist');
        cy.contains('node3').should('not.exist');

        cy.get('button').eq(2).click();
        cy.contains('node1').should('not.exist');
        cy.contains('node2').should('not.exist');
        cy.contains('node3').should('exist');

    });
});