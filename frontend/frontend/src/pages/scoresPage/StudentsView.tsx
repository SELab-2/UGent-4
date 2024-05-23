import { Divider, EvenlySpacedRow } from '../../components/CustomComponents.tsx'
import { Box, Skeleton, Typography } from '@mui/material'
import List from '@mui/material/List'
import { StudentScoreListItem } from './StudentScoreListItem.tsx'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import instance from '../../axiosConfig.ts'
import { Project, ScoreGroep } from './ProjectScoresPage.tsx'

interface StudentsViewProps {
    project: Project
    groepen: ScoreGroep[]
    setGroepen: (groepen: ScoreGroep[]) => void
    changeScore: (index: number, score: number) => void
}

export function StudentsView({
    project,
    groepen,
    setGroepen,
    changeScore,
}: StudentsViewProps) {
    //state for loading the page
    const [loading, setLoading] = useState(true)

    // useEffect hook to periodically fetch all data
    useEffect(() => {
        async function fetchGroups(assignment: Project): Promise<ScoreGroep[]> {
            try {
                const groupsResponse = await instance.get(
                    `/groepen/?project=${assignment.project_id.toString()}`
                )
                return groupsResponse.data.map(
                    (group: ScoreGroep, index: number) => ({
                        group: group,
                        group_number: index + 1,
                    })
                )
            } catch (error) {
                console.error('Error fetching data:', error)
                return []
            }
        }

        async function fetchSubmission(
            scoregroep: ScoreGroep
        ): Promise<ScoreGroep> {
            try {
                const submissionResponse = await instance.get(
                    `/indieningen/?groep=${scoregroep.group.groep_id.toString()}`
                )
                const lastSubmission =
                    submissionResponse.data[submissionResponse.data.length - 1]
                return {
                    ...scoregroep,
                    lastSubmission: lastSubmission,
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                return scoregroep
            }
        }

        async function fetchScore(scoregroep: ScoreGroep): Promise<ScoreGroep> {
            if (!scoregroep.lastSubmission) {
                return scoregroep
            }
            try {
                const scoreResponse = await instance.get(
                    `/scores/?indiening=${scoregroep.lastSubmission.indiening_id.toString()}`
                )
                return {
                    ...scoregroep,
                    score: scoreResponse.data[0],
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                return {
                    ...scoregroep,
                    score: {
                        score: undefined,
                    },
                }
            }
        }

        async function fetchData() {
            try {
                setLoading(true)
                const groupArray = await fetchGroups(project)

                const submissionPromises = groupArray.map((scoregroep) =>
                    fetchSubmission(scoregroep)
                )
                const submissionArray = await Promise.all(submissionPromises)

                const scorePromises = submissionArray.map((scoregroep) =>
                    fetchScore(scoregroep)
                )
                const scoreArray = await Promise.all(scorePromises)

                setGroepen(scoreArray)
            } catch (error) {
                console.error('Error fetching all data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData().catch((e) => console.error(e))
    }, [project, setGroepen])

    return (
        <>
            {/* Header section */}
            <Box
                aria-label={'scoresHeader'}
                sx={{
                    backgroundColor: 'secondary.main',
                    height: 20,
                    padding: 3,
                }}
            >
                <EvenlySpacedRow
                    items={[
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 'bold' }}
                            data-cy="groupHeader"
                        >
                            {t('group')}
                        </Typography>,
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 'bold' }}
                            data-cy="timeHeader"
                        >
                            {t('time')}
                        </Typography>,
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 'bold' }}
                            data-cy="scoreHeader"
                        >
                            Score
                        </Typography>,
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 'bold' }}
                            data-cy="downloadHeader"
                        >
                            Download
                        </Typography>,
                    ]}
                />
            </Box>
            <Divider color={'text.main'}></Divider>
            <Box
                aria-label={'studentList'}
                sx={{
                    backgroundColor: 'background.default',
                    height: 450,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Scrollable list of students */}
                <Box display={'flex'} flexDirection={'row'}>
                    <Box sx={{ width: '100%', height: 430, overflow: 'auto' }}>
                        <List disablePadding={true}>
                            {/* Mapping through groups to render StudentScoreListItem */}
                            {loading ? (
                                [...Array(3)].map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant="rectangular"
                                        height={40}
                                        width={'97%'}
                                        sx={{
                                            margin: 1,
                                            borderRadius: 1,
                                        }}
                                    />
                                ))
                            ) : (
                                <>
                                    {groepen.map((groep, index) => (
                                        <StudentScoreListItem
                                            key={groep.group.groep_id}
                                            groupNumber={groep.group_number}
                                            studenten={groep.group.studenten}
                                            lastSubmission={
                                                groep.lastSubmission
                                            }
                                            score={groep.score?.score}
                                            maxScore={project.max_score}
                                            changeScore={(score: number) =>
                                                changeScore(index, score)
                                            }
                                        />
                                    ))}
                                </>
                            )}
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
