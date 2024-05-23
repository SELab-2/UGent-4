import { ItemList } from '../../src/components/ItemList'
import fixtures from '../fixtures/fixtures.json'

describe('ItemList', () => {
    const mockProps = {
        itemList: fixtures.itemList,
    }

    it('renders', () => {
        cy.mount(<ItemList {...mockProps} />)
        cy.get('.MuiPaper-root').should('exist')
        cy.get('.MuiTable-root').should('exist')
        cy.get('#head').should('exist')
        cy.get('#head')
            .find('#opdracht')
            .should('exist')
            .should('have.text', 'Opdracht')
        cy.get('#head')
            .find('#deadline')
            .should('exist')
            .should('have.text', 'Deadline')
        cy.get('#head')
            .find('#status')
            .should('exist')
            .should('have.text', 'Status')
        cy.get('#body').should('exist')
        cy.get('.MuiTableCell-root').should('exist')
        cy.get('.MuiTableRow-root').should('exist')

        for (let i = 0; i < fixtures.itemList.length; i++) {
            cy.get(`#${i}`).should('exist')
            cy.get(`#${i}`)
                .find('#opdracht')
                .should('exist')
                .should('have.text', fixtures.itemList[i].opdracht)
            cy.get(`#${i}`)
                .find('#deadline')
                .should('exist')
                .should('have.text', fixtures.itemList[i].deadline)
            cy.get(`#${i}`)
                .find('#status')
                .should('exist')
                .should('have.text', fixtures.itemList[i].status)
            cy.get(`#${i}`)
                .find('#score')
                .should('exist')
                .should('have.text', fixtures.itemList[i].score)
        }
    })
})
