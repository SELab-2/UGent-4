import TabSwitcher from '../../src/components/TabSwitcher'
import { ThemeProvider } from '@mui/system'
import theme from '../../src/Theme.ts'

describe('TabSwitcher', () => {
    const mockProps = {
        titles: ['assignment', 'students', 'groups'],
        nodes: [<div>node1</div>, <div>node2</div>, <div>node3</div>],
    }

    it('renders', () => {
        cy.mount(
            <ThemeProvider theme={theme}>
                    <TabSwitcher {...mockProps} />
            </ThemeProvider>
        )
        // the titles do not render because of internationalization?
        cy.get('#tab0').should('exist')
        cy.get('#node0').should('exist').should('be.visible')
        cy.get('#node1').should('exist').should('not.be.visible')
        cy.get('#node2').should('exist').should('not.be.visible')
        cy.contains('node1').should('exist')
        cy.contains('node2').should('not.exist')
        cy.contains('node3').should('not.exist')

        cy.get('#tab1').click()
        cy.get('#node0').should('exist').should('not.be.visible')
        cy.get('#node1').should('exist').should('be.visible')
        cy.get('#node2').should('exist').should('not.be.visible')
        cy.contains('node1').should('not.exist')
        cy.contains('node2').should('exist')
        cy.contains('node3').should('not.exist')

        cy.get('#tab2').click()
        cy.get('#node0').should('exist').should('not.be.visible')
        cy.get('#node1').should('exist').should('not.be.visible')
        cy.get('#node2').should('exist').should('be.visible')
        cy.contains('node1').should('not.exist')
        cy.contains('node2').should('not.exist')
        cy.contains('node3').should('exist')
    })
})
