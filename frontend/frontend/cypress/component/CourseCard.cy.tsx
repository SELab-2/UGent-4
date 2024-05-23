import { CourseCard } from '../../src/components/CourseCard'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../fixtures/fixtures.json'

describe('CourseCard', () => {
    const mockProps = {
        courseId: fixtures.id,
        archived: false,
        isStudent: true,
    }

    it('renders as student', () => {
        cy.mount(
            <BrowserRouter>
                <CourseCard {...mockProps} />
            </BrowserRouter>
        )
        // data is fetched from the backend, so we can't check that
        cy.get('.MuiCard-root').should('exist')
        cy.get('.MuiCardContent-root').should('exist')
        cy.get('#courseInfo')
            .should('have.text', 'undefined: undefined: 0')
            .click()
        cy.get('#student').should('exist')
        cy.get('#teacherArchived').should('not.exist')
        cy.get('#teacherNonArchived').should('not.exist')
        cy.get('#project').contains('Project')
        cy.get('#deadline').contains('Deadline')
        cy.get('#status').contains('Status')
        cy.get('#archiveButton').should('not.exist')
    })

    it('renders archived as teacher', () => {
        const mockProps = {
            courseId: fixtures.id,
            archived: true,
            isStudent: false,
        }
        cy.mount(
            <BrowserRouter>
                <CourseCard {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiCard-root').should('exist')
        cy.get('.MuiCardContent-root').should('exist')
        cy.get('#courseInfo')
            .should('have.text', 'undefined: undefined: 0')
            .click()
        cy.get('#student').should('not.exist')
        cy.get('#teacherArchived').should('exist')
        cy.get('#teacherNonArchived').should('not.exist')
        cy.get('#project').contains('Project')
        cy.get('#deadline').contains('Deadline')
        cy.get('#status').should('not.exist')
        cy.get('#archiveButton').should('not.exist')
    })

    it('renders non-archived as teacher', () => {
        const mockProps = {
            courseId: fixtures.id,
            archived: false,
            isStudent: false,
        }
        cy.mount(
            <BrowserRouter>
                <CourseCard {...mockProps} />
            </BrowserRouter>
        )
        cy.get('.MuiCard-root').should('exist')
        cy.get('.MuiCardContent-root').should('exist')
        cy.get('#courseInfo')
            .should('have.text', 'undefined: undefined: 0')
            .click()
        cy.get('#student').should('not.exist')
        cy.get('#teacherArchived').should('not.exist')
        cy.get('#teacherNonArchived').should('exist')
        cy.get('#project').contains('Project')
        cy.get('#deadline').contains('Deadline')
        cy.get('#status').should('not.exist')
        cy.get('#archiveButton').should('exist')
    })
})
