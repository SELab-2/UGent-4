import { StudentsView } from '../../../src/pages/scoresPage/StudentsView'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../../fixtures/fixtures.json'
import { t } from 'i18next'

describe('StudentsView', () => {
    const mockProps = {
        project: fixtures.fullProject,
        groepen: fixtures.scoreGroups,
        setGroepen: () => {},
        changeScore: () => {},
    }

    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <StudentsView {...mockProps} />
            </BrowserRouter>
        )
        //cy.get('[data-cy=groupHeader]').should('have.text', t('group'))
        //cy.get('[data-cy=timeHeader]').should('have.text', t('time'))
        cy.get('[data-cy=scoreHeader]').should('have.text', 'Score')
        cy.get('[data-cy=downloadHeader]').should('have.text', 'Download')
    })
})
