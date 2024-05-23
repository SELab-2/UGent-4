import { AssignmentListItemSubjectsPage } from '../../../src/pages/subjectsPage/AssignmentListItemSubjectsPage'
import { BrowserRouter } from 'react-router-dom'
import fixtures from '../../fixtures/fixtures.json'
import dayjs from 'dayjs'

describe('AssignmentListItemSubjectsPage', () => {
    const mockProps = {
        projectName: fixtures.project,
        dueDate: fixtures.fullProject.deadline,
        submissions: 3,
        score: { score: fixtures.fullProject.max_score },
        maxScore: fixtures.fullProject.max_score,
        isStudent: true,
        archived: false,
        visible: true,
        deleteEvent: () => {},
        archiveEvent: () => {},
        visibilityEvent: () => {},
        courseId: fixtures.id,
        assignmentId: fixtures.id,
    }

    it('renders', () => {
        cy.mount(
            <BrowserRouter>
                <AssignmentListItemSubjectsPage {...mockProps} />
            </BrowserRouter>
        )
        cy.get(`#projectName`)
            .should('exist')
            .should('contain', mockProps.projectName)
        cy.get('#deadline')
            .should('exist')
            .should(
                'contain',
                dayjs(mockProps.dueDate).format('DD/MM/YYYY HH:mm')
            )
        cy.get('#score')
            .should('exist')
            .should('contain', mockProps.score.score + '/' + mockProps.maxScore)
        cy.get('#submissions')
            .should('exist')
            .should('contain', mockProps.submissions)
    })

    it('renders as teacher', () => {
        mockProps.isStudent = false
        cy.mount(
            <BrowserRouter>
                <AssignmentListItemSubjectsPage {...mockProps} />
            </BrowserRouter>
        )
        cy.get(`#projectName`)
            .should('exist')
            .should('contain', mockProps.projectName)
        cy.get('#deadline')
            .should('exist')
            .should(
                'contain',
                dayjs(mockProps.dueDate).format('DD/MM/YYYY HH:mm')
            )
        cy.get('#score').should('not.exist')
        cy.get('#submissions').should('not.exist')
        cy.get('#archive').should('exist')
        cy.get('#delete').should('exist')
        cy.get('#notVisible').should('not.exist')
        cy.get('#visible').should('exist').click()
        cy.get('#visible').should('not.exist')
        cy.get('#notVisible').should('exist')
    })
})
