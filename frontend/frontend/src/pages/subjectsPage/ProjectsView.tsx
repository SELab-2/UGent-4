import {
    Card,
    Divider,
    EvenlySpacedRow,
} from '../../components/CustomComponents.tsx'
import { Box, Skeleton, Typography } from '@mui/material'
import List from '@mui/material/List'
import { t } from 'i18next'
import { AssignmentListItemSubjectsPage } from './AssignmentListItemSubjectsPage.tsx'
import instance from '../../axiosConfig'
import { useEffect, useState } from 'react'
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
    showAllAssignments: boolean
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
    showAllAssignments,
    archived,
    assignments,
    deleteAssignment,
    archiveAssignment,
    changeVisibilityAssignment,
    courseId,
}: ProjectsViewProps) {
    const [projects, setProjects] = useState<ProjectStudent[]>([])
    const [lastSubmission, setLastSubmission] = useState<Submission>()

    // state to keep track of the loading state
    const [loading, setLoading] = useState(true)

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
                const lastSubmission = submissionsResponse.data.sort(
                    (a: Submission, b: Submission) =>
                        dayjs(a.tijdstip).isAfter(dayjs(b.tijdstip)) ? 1 : -1
                )[0]
                setLastSubmission(lastSubmission)
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
                //TODO fix correct waiting for all data to be fetched
                setLoading(true)
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

                scoreArray.sort((a, b) => {
                    return dayjs(a.assignment.deadline).isAfter(
                        dayjs(b.assignment.deadline)
                    )
                        ? 1
                        : -1
                })

                const pastAndTodayDeadlines: ProjectStudent[] = []
                const futureDeadlines: ProjectStudent[] = []
                const today = dayjs()
                // Separate the items based on their deadline
                scoreArray.forEach((item) => {
                    if (
                        dayjs(item.assignment.deadline).isBefore() ||
                        dayjs(item.assignment.deadline).isSame(today)
                    ) {
                        pastAndTodayDeadlines.push(item)
                    } else {
                        futureDeadlines.push(item)
                    }
                })

                setProjects(futureDeadlines.concat(pastAndTodayDeadlines))
            } catch (e) {
                console.error('Error fetching all data:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchData().catch((err) => console.error(err))
    }, [assignments, gebruiker.user])

    return (
        <>
            <Card sx={{ width: '95%' }}>
                <Box
                    aria-label={'courseHeader'}
                    sx={{
                        backgroundColor: 'secondary.main',
                        height: 20,
                        padding: 3,
                    }}
                >
                    {!gebruiker.is_lesgever ? (
                        <>
                            {/* Show the UI from the perspective of a student. */}
                            <EvenlySpacedRow
                                items={[
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Project
                                    </Typography>,
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Deadline
                                    </Typography>,
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {t('submissions')}
                                    </Typography>,
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Score
                                    </Typography>,
                                ]}
                            />
                        </>
                    ) : (
                        <>
                            {/* Show the UI from the perspective of a teacher. */}
                            <EvenlySpacedRow
                                items={[
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Project
                                    </Typography>,
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Deadline
                                    </Typography>,
                                    <Typography
                                        variant={'h5'}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {t('edit')}
                                    </Typography>,
                                ]}
                            />
                        </>
                    )}
                </Box>
                <Box
                    aria-label={'assignmentList'}
                    sx={{
                        backgroundColor: 'background.default',
                        height: 340,
                    }}
                >
                    <Box sx={{ width: '100%', height: 320, overflow: 'auto' }}>
                        {/* The list below will display the projects with their information */}
                        <List disablePadding>
                            {loading ? (
                                [...Array(3).keys()].map((index) => (
                                    <Skeleton
                                        width={'100%'}
                                        height={50}
                                        key={index}
                                        variant={'text'}
                                    />
                                ))
                            ) : (
                                <>
                                    {projects
                                        .map((project, index) => ({
                                            ...project,
                                            index,
                                        }))
                                        .filter(
                                            (project) =>
                                                project.assignment
                                                    .gearchiveerd == archived ||
                                                showAllAssignments
                                        )
                                        .filter(
                                            (project) =>
                                                project.assignment.zichtbaar ||
                                                gebruiker.is_lesgever
                                        )
                                        .map((project) => (
                                            <>
                                                <Divider />
                                                <AssignmentListItemSubjectsPage
                                                    lastSubmission={
                                                        lastSubmission
                                                    }
                                                    key={
                                                        project.assignment
                                                            .project_id
                                                    }
                                                    projectName={
                                                        project.assignment.titel
                                                    }
                                                    dueDate={
                                                        project.assignment
                                                            .deadline
                                                            ? dayjs(
                                                                  project
                                                                      .assignment
                                                                      .deadline
                                                              )
                                                            : undefined
                                                    }
                                                    submissions={
                                                        project.submissions
                                                            ? project.submissions
                                                            : 0
                                                    }
                                                    score={project.score}
                                                    maxScore={Number(
                                                        project.assignment
                                                            .max_score
                                                    )}
                                                    isStudent={
                                                        !gebruiker.is_lesgever
                                                    }
                                                    archived={archived}
                                                    visible={
                                                        project.assignment
                                                            .zichtbaar
                                                    }
                                                    deleteEvent={() =>
                                                        deleteAssignment(
                                                            project.assignment
                                                                .project_id
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
                                            </>
                                        ))}
                                </>
                            )}
                        </List>
                    </Box>
                </Box>
            </Card>
        </>
    )
}
