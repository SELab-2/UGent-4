import { Header } from '../../components/Header.tsx'
import { Box, Button, Stack } from '@mui/material'
import TabSwitcher from '../../components/TabSwitcher.tsx'
import { ArchivedView } from './ArchivedView.tsx'
import { CoursesView } from './CoursesView.tsx'
import { DeadlineCalendar } from '../../components/DeadlineCalendar.tsx'
import dayjs, { Dayjs } from 'dayjs'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import instance from '../../axiosConfig.ts'
import { AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { CourseCardSkeleton } from '../../components/CourseCardSkeleton.tsx'

export interface Course {
    vak_id: number
    naam: string
    studenten: number[]
    lesgevers: number[]
}

export interface project {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: File | null
    vak_id: number
    deadline: string
    extra_deadline: string | null
    max_score: number
    max_groepsgrootte: number
    zichtbaar: boolean
    gearchiveerd: boolean
}

/**
 * MainPage function component
 * This is the main page of the application.
 * It contains a header, a tab switcher for current and archived courses, a deadline calendar, and an admin button.
 */
export default function MainPage() {
    // State for role
    const [role, setRole] = useState<string>('student')
    const [courses, setCourses] = useState<Course[]>([])
    const [deadlines, setDeadlines] = useState<Dayjs[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    //navigator for routing
    const navigator = useNavigate()

    useEffect(() => {
        console.log('requesting api')
        //set loading to true every time the data is requested

        // Get the courses, their projects, and their respective deadlines + the role of the user
        async function fetchData() {
            //set loading to true every time the data is requested
            setLoading(true)
            await instance
                .get('/gebruikers/me/')
                .then((response: AxiosResponse) => {
                    console.log(response.data)
                    setRole(response.data.is_lesgever ? 'teacher' : 'student')
                })
                .catch((e: AxiosError) => {
                    console.error(e)
                })

            try {
                const response =
                    await instance.get<Course[]>('/vakken/?in=true')
                setCourses(response.data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }

            await instance
                .get('/projecten/')
                .then((response: AxiosResponse) => {
                    const deadlines: Dayjs[] = []
                    response.data.forEach((project: project) => {
                        if (project.zichtbaar && !project.gearchiveerd) {
                            deadlines.push(
                                dayjs(project.deadline, 'YYYY-MM-DD-HH:mm:ss')
                            )
                        }
                    })
                    console.log(deadlines)
                    setDeadlines(deadlines)
                })
                .catch((e: AxiosError) => {
                    console.error(e)
                })
            setLoading(false)
        }

        fetchData().catch((e) => {
            console.error(e)
        })
    }, [])

    useEffect(() => {}, [courses])

    return (
        <>
            <Stack
                direction={'column'}
                spacing={5}
                sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'background.default',
                    paddingTop: 5,
                }}
            >
                <Header variant={'default'} title={'Pigeonhole'} />
                <Box
                    sx={{
                        width: '100%',
                        height: '80%',
                        marginTop: 10,
                        display: 'flex',
                        flexDirection: { md: 'row', xs: 'column-reverse' },
                        gap: 2,
                    }}
                >
                    {/* Two tabs to select either the current or archived courses,
                    CoursesView is a scroll-box with the current courses, 
                    ArchivedView is the same but for the archived courses.  */}
                    <TabSwitcher
                        titles={['current_courses', 'archived']}
                        nodes={
                            loading
                                ? [
                                      <Stack
                                          flexDirection={{
                                              xs: 'column-reverse',
                                              md: 'row',
                                          }}
                                          minWidth={{
                                              md: '60svw',
                                              lg: '69svw',
                                          }}
                                      >
                                          {[...Array(3)].map((_, index) => (
                                              <CourseCardSkeleton key={index} />
                                          ))}
                                      </Stack>,
                                      <Stack
                                          flexDirection={{
                                              xs: 'column-reverse',
                                              md: 'row',
                                          }}
                                          minWidth={{
                                              md: '60svw',
                                              lg: '69svw',
                                          }}
                                      >
                                          {[...Array(3)].map((_, index) => (
                                              <CourseCardSkeleton key={index} />
                                          ))}
                                      </Stack>,
                                  ]
                                : [
                                      <CoursesView
                                          isStudent={role == 'student'}
                                          activecourses={courses}
                                      />,
                                      <ArchivedView
                                          isStudent={role == 'student'}
                                          archivedCourses={courses}
                                      />,
                                  ]
                        }
                    />

                    {/* Add a calendar to the right of the mainpage. */}
                    <Box
                        aria-label={'calendarView'}
                        display={'flex'}
                        flexDirection={'row'}
                        alignContent={'center'}
                        height={'50%'}
                    >
                        <DeadlineCalendar deadlines={deadlines} />
                    </Box>
                </Box>
                {role === 'admin' && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '5%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'end',
                        }}
                    >
                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            on-click={() => navigator('/addTeacher')}
                            aria-label={'admin-button'}
                            sx={{ margin: 5 }}
                        >
                            {t('add_teacher')}
                        </Button>
                    </Box>
                )}
            </Stack>
        </>
    )
}
