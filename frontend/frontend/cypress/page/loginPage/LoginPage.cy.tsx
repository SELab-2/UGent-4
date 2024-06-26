import { LoginPage } from '../../../src/pages/loginPage/LoginPage.tsx'
import { BrowserRouter } from 'react-router-dom'

describe('LoginPage', () => {
    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        )
        cy.get('#logo').should('exist')
        cy.get('[data-cy=loginButton]').should('exist')
        cy.get('[data-cy=logoDuif]').should('exist')
    })
})
