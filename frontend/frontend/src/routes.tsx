import {createBrowserRouter} from "react-router-dom";
import {SubjectsStudentPage} from "./pages/subjectsPage/SubjectsStudentPage.tsx";
import {AssignmentTeacherPage} from "./pages/assignmentPage/AssignmentTeacherPage.tsx";
import {AssignmentStudentPage} from "./pages/assignmentPage/AssignmentStudentPage.tsx";
import {SubmissionPage} from "./pages/submissionPage/SubmissionPage.tsx";
import {ProjectScoresPage} from "./pages/scoresPage/ProjectScoresPage.tsx";
import {SubjectsTeacherPage} from "./pages/subjectsPage/SubjectsTeacherPage.tsx";
import {AddChangeAssignmentPage} from "./pages/addChangeAssignmentPage/AddChangeAssignmentPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import {MainPage} from "./pages/mainPage/MainPage.tsx";


//TODO: add change/add course page when implemented
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId',
        element: <SubjectsStudentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId',
        element: <SubjectsTeacherPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/:assignmentId',
        element: <AssignmentTeacherPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId/assignment/:assignmentId',
        element: <AssignmentStudentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_student/:courseId/assignment/:assignmentId/submission/:submissionId',
        element: <SubmissionPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/:assignmentId/scoring',
        element: <ProjectScoresPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/course_teacher/:courseId/assignment/edit/:assignmentId?',
        element: <AddChangeAssignmentPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '*',
        element: <ErrorPage/>,
    },
]);

export default router;