import StudentPopUp from '../../../src/pages/subjectsPage/StudentPopUp'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../../fixtures/fixtures.json'
import { t } from 'i18next'

describe('StudentPopUp', () => {
    const mockProps = {
        students: [],
        text: 'test popup text',
        noGroup: false,
    }

    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <StudentPopUp {...mockProps} />
            </BrowserRouter>
        )
        cy.get('[data-cy=secondaryButton]').should('exist')
        cy.get('#scroll-dialog-title').should('not.exist')
        //cy.get('#scroll-dialog-title').should('have.text', mockProps.text)
        //cy.get('[data-cy=noGroup]').should('exist')
        //cy.get('[data-cy=noGroup]').should('have.text', t('noGroup'))
        //cy.get('[data-cy=contactTeacher]').should('exist')
        //cy.get('[data-cy=contactTeacher]').should(
        //    'have.text',
        //    t('contactTeacher')
        //)
    })
})
