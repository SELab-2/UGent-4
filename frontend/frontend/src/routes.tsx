import { createBrowserRouter } from 'react-router-dom'
import { SubjectsPage } from './pages/subjectsPage/SubjectsPage.tsx'
import { SubmissionPage } from './pages/submissionPage/SubmissionPage.tsx'
import { ProjectScoresPage } from './pages/scoresPage/ProjectScoresPage.tsx'
import { AddChangeAssignmentPage } from './pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx'
import { AddChangeSubjectPage } from './pages/subjectsPage/AddChangeSubjectPage.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import MainPage from './pages/mainPage/MainPage.tsx'
import { GroupsPage } from './pages/groupsPage/GroupsPage.tsx'
import { AssignmentPage } from './pages/assignmentPage/AssignmentPage.tsx'

//TODO: add change/add course page when implemented
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/:accept_invite?',
        element: <SubjectsPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/assignment/:assignmentId/groups',
        element: <GroupsPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/assignment/:assignmentId',
        element: <AssignmentPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/assignment/:assignmentId/submission/:submissionId',
        element: <SubmissionPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/assignment/:assignmentId/scoring',
        element: <ProjectScoresPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/assignment/:assignmentId?/edit',
        element: <AddChangeAssignmentPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/course/:courseId/edit',
        element: <AddChangeSubjectPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
])

export default router
