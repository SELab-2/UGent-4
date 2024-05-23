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

    it('renders as student', () => {
        cy.mount(
            <BrowserRouter>
                <AssignmentListItemSubjectsPage {...mockProps} />
            </BrowserRouter>
        )
        cy.get(`#${mockProps.projectName.replace(/\s/g, '')}`)
            .should('exist')
            .should('contain', mockProps.projectName)
        cy.get('[data-cy=deadline]')
            .should('exist')
            .should(
                'contain',
                dayjs(mockProps.dueDate).format('DD/MM/YYYY HH:mm')
            )
        cy.get('[data-cy=score]')
            .should('exist')
            .should('contain', mockProps.score.score + '/' + mockProps.maxScore)
        cy.get('[data-cy=submissions]')
            .should('exist')
            .should('contain', mockProps.submissions)
    });

    it('renders as teacher', () => {
        mockProps.isStudent = false;
        cy.mount(<BrowserRouter><AssignmentListItemSubjectsPage {...mockProps}/></BrowserRouter>);
        cy.get(`[data-cy=teacherProjectName]`)
            .should('exist')
            .should('contain', mockProps.projectName)
        cy.get('[data-cy=teacherDeadline]')
            .should('exist')
            .should(
                'contain',
                dayjs(mockProps.dueDate).format('DD/MM/YYYY HH:mm')
            )
    })
})
