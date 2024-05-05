import { Card, Divider } from '../../components/CustomComponents.tsx'
import { Box, Typography } from '@mui/material'
import List from '@mui/material/List'
import { t } from 'i18next'
import { AssignmentListItemSubjectsPage } from './AssignmentListItemSubjectsPage.tsx'
import instance from '../../axiosConfig'
import { useState, useEffect } from 'react'
import { Project } from '../scoresPage/ProjectScoresPage.tsx'
import { Group } from '../groupsPage/GroupsPage.tsx'
import { Submission } from '../submissionPage/SubmissionPage.tsx'
import { Score } from '../../components/SubmissionListItemTeacherPage.tsx'
import { User } from './AddChangeSubjectPage.tsx'
import dayjs from 'dayjs'

interface ProjectStudent {
    assignment: Project
    group?: Group
    lastSubmission?: Submission
    submissions?: number
    score?: Score
}

interface ProjectsViewProps {
    gebruiker: User
    archived: boolean
    assignments: Project[]
    deleteAssignment: (index: number) => void
    archiveAssignment: (index: number) => void
    changeVisibilityAssignment: (index: number) => void
    courseId: string
}

/**
 * This View is used as a part of the SubjectsPage.
 * It displays a box that lists The projects with some brief info.
 * @param gebruiker: the user that wants to view the page.
 */
export function ProjectsView({
    gebruiker,
    archived,
    assignments,
    deleteAssignment,
    archiveAssignment,
    changeVisibilityAssignment,
    courseId,
}: ProjectsViewProps) {
    const [projects, setProjects] = useState<ProjectStudent[]>([])

    // useEffect hook to periodically fetch all data
    useEffect(() => {
        async function fetchGroup(
            assignment: Project
        ): Promise<ProjectStudent> {
            try {
                const groupResponse = await instance.get(
                    `/groepen/?project=${assignment.project_id.toString()}&student=${gebruiker.user}`
                )
                if (groupResponse.data.length == 0) {
                    return {
                        assignment: assignment,
                    }
                }
                return {
                    assignment: assignment,
                    group: groupResponse.data[0],
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                return {
                    assignment: assignment,
                }
            }
        }
        async function fetchSubmission(
            projectstudent: ProjectStudent
        ): Promise<ProjectStudent> {
            if (!projectstudent.group) {
                return projectstudent
            }
            try {
                const submissionsResponse = await instance.get(
                    `/indieningen/?groep=${projectstudent.group.groep_id?.toString()}&project=${projectstudent.assignment.project_id.toString()}`
                )
                const lastSubmission =
                    submissionsResponse.data[
                        submissionsResponse.data.length - 1
                    ]
                return {
                    ...projectstudent,
                    lastSubmission: lastSubmission,
                    submissions: submissionsResponse.data.length,
                }
            } catch (e) {
                console.error('Error fetching data:', e)
                return projectstudent
            }
        }
        async function fetchScore(
            projectstudent: ProjectStudent
        ): Promise<ProjectStudent> {
            if (!projectstudent.group || !projectstudent.lastSubmission) {
                return projectstudent
            }
            try {
                const scoreResponse = await instance.get(
                    `/scores/?indiening=${projectstudent.lastSubmission.indiening_id.toString()}`
                )
                return {
                    ...projectstudent,
                    score: scoreResponse.data[0],
                }
            } catch (e) {
                console.error('Error fetching data:', e)
                return projectstudent
            }
        }

        async function fetchData() {
            try {
                const groupPromises = assignments.map((assignment) =>
                    fetchGroup(assignment)
                )
                const groupArray = await Promise.all(groupPromises)

                const submissionPromises = groupArray.map((projectstudent) =>
                    fetchSubmission(projectstudent)
                )
                const submissionArray = await Promise.all(submissionPromises)

                const scorePromises = submissionArray.map((projectstudent) =>
                    fetchScore(projectstudent)
                )
                const scoreArray = await Promise.all(scorePromises)

                setProjects(scoreArray)
            } catch (e) {
                console.error('Error fetching all data:', e)
            }
        }
        fetchData().catch((err) => console.error(err))
    }, [assignments, gebruiker.user])

    return (
        <>
            <Card>
                <Box
                    aria-label={'courseHeader'}
                    sx={{
                        backgroundColor: 'primary.light',
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: '30px',
                    }}
                >
                    {!gebruiker.is_lesgever ? (
                        <>
                            {/* Show the UI from the perspective of a student. */}
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Project
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Deadline
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                {t('submissions')}
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Score
                            </Typography>
                        </>
                    ) : (
                        <>
                            {/* Show the UI from the perspective of a teacher. */}
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Project
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Deadline
                            </Typography>
                            <Typography
                                variant={'h5'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                {t('edit')}
                            </Typography>
                        </>
                    )}
                </Box>
                <Box
                    aria-label={'assignmentList'}
                    sx={{
                        backgroundColor: 'background.default',
                        height: 340,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        paddingBottom: 0,
                    }}
                >
                    <Box display={'flex'} flexDirection={'row'}>
                        <Box
                            sx={{
                                width: '100%',
                                height: 320,
                                overflow: 'auto',
                            }}
                        >
                            {/* The list below will display the projects with their information */}
                            <List disablePadding={true}>
                                {projects
                                    .map((project, index) => ({
                                        ...project,
                                        index,
                                    }))
                                    .filter(
                                        (project) =>
                                            project.assignment.gearchiveerd ==
                                            archived
                                    )
                                    .filter(
                                        (project) =>
                                            project.assignment.zichtbaar ||
                                            gebruiker.is_lesgever
                                    )
                                    .map((project) => (
                                        <>
                                            <AssignmentListItemSubjectsPage
                                                key={
                                                    project.assignment
                                                        .project_id
                                                }
                                                projectName={
                                                    project.assignment.titel
                                                }
                                                dueDate={dayjs(
                                                    project.assignment.deadline
                                                )}
                                                submissions={
                                                    project.submissions
                                                        ? project.submissions
                                                        : 0
                                                }
                                                score={
                                                    project.score
                                                        ? project.score
                                                        : {
                                                              score_id: 0,
                                                              score: 0,
                                                              indiening: 0,
                                                          }
                                                }
                                                maxScore={Number(
                                                    project.assignment.max_score
                                                )}
                                                isStudent={
                                                    !gebruiker.is_lesgever
                                                }
                                                archived={archived}
                                                visible={
                                                    project.assignment.zichtbaar
                                                }
                                                deleteEvent={() =>
                                                    deleteAssignment(
                                                        project.index
                                                    )
                                                }
                                                archiveEvent={() =>
                                                    archiveAssignment(
                                                        project.index
                                                    )
                                                }
                                                visibilityEvent={() =>
                                                    changeVisibilityAssignment(
                                                        project.index
                                                    )
                                                }
                                                courseId={courseId}
                                                assignmentId={project.assignment.project_id.toString()}
                                            />
                                            <Divider
                                                color={'text.main'}
                                            ></Divider>
                                        </>
                                    ))}
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </>
    )
}
