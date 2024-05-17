import { Header } from '../../components/Header.tsx'
import { Button } from '../../components/CustomComponents.tsx'
import { Box, Stack } from '@mui/material'
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
import WarningPopup from '../../components/WarningPopup.tsx'

export interface Course {
    vak_id: number
    naam: string
    studenten: number[]
    lesgevers: number[]
    gearchiveerd: boolean
}

export interface project {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: File | null
    vak: number
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
    const [user, setUser] = useState<number>(0)
    const [role, setRole] = useState<string>('student')
    const [courses, setCourses] = useState<Course[]>([])
    const [pinnedCourses, setPinnedCourses] = useState<number[]>([])
    const [courseOrder, setCourseOrder] = useState<number[]>([])
    const [deadlines, setDeadlines] = useState<Dayjs[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    //navigator for routing
    const [assignments, setAssignments] = useState<project[]>([])
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
                    setUser(response.data.user)
                    setRole(response.data.is_lesgever ? 'teacher' : 'student')
                    setPinnedCourses(response.data.gepinde_vakken)
                })
                .catch((e: AxiosError) => {
                    console.error(e)
                })

            let courses: Course[] = []
            try {
                const response =
                    await instance.get<Course[]>('/vakken/?in=true')
                courses = response.data
                setCourses(response.data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }

            const deadlines: Dayjs[] = []
            const assignments: project[] = []
            for(const course of courses){
                await instance
                    .get(`/projecten/?vak=${course.vak_id}`)
                    .then((response: AxiosResponse) => {
                        response.data.forEach((project: project) => {
                            if (project.zichtbaar && !project.gearchiveerd) {
                                deadlines.push(
                                    dayjs(project.deadline)
                                )
                                assignments.push(
                                    project
                                )
                            }
                        })
                    })
                    .catch((e: AxiosError) => {
                        console.error(e)
                    })
            }
            console.log(deadlines)
            setDeadlines(deadlines)
            setAssignments(assignments)

            setLoading(false)
        }

        fetchData().catch((e) => {
            console.error(e)
        })
    }, [])

    // Logging order of courses
    // This only changes on page reload
    useEffect(() => {
        instance
            .get('/gebruikers/me/')
            .then((response: AxiosResponse) => {
                setCourseOrder(response.data.gepinde_vakken)
            })
            .catch((e: AxiosError) => {
                console.error(e)
            })
    }, [])

    useEffect(() => {}, [courses])

    const [openArchivePopup, setOpenArchivePopup] = useState(false)
    const [archiveCourseId, setArchiveCourseId] = useState(0)

    const archiveCourse = (courseId: number) => {
        setArchiveCourseId(courseId)
        setOpenArchivePopup(true)
    }
    const doArchive = async () => {
        console.log('Archive clicked')
        try {
            await instance.patch(`/vakken/${archiveCourseId}/`, {
                gearchiveerd: true,
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

    const pinCourse = async (courseId: number) => {
        let newPinnedCourses = []
        if (pinnedCourses.includes(courseId)) {
            newPinnedCourses = pinnedCourses.filter(
                (pinnedId) => pinnedId !== courseId
            )
        } else {
            newPinnedCourses = [...pinnedCourses, courseId]
        }
        setPinnedCourses(newPinnedCourses)
        try {
            await instance.patch(`/gebruikers/${user}/`, {
                gepinde_vakken: newPinnedCourses,
            })
        } catch (error) {
            console.error('Error updating data:', error)
        }
    }

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
                                          activecourses={courses
                                              .filter(
                                                  (course) =>
                                                      !course.gearchiveerd
                                              )
                                              .sort((a: Course, b: Course) => {
                                                  if (
                                                      courseOrder.includes(
                                                          a.vak_id
                                                      )
                                                  ) {
                                                      if (
                                                          courseOrder.includes(
                                                              b.vak_id
                                                          )
                                                      ) {
                                                          return (
                                                              courseOrder.indexOf(
                                                                  a.vak_id
                                                              ) -
                                                              courseOrder.indexOf(
                                                                  b.vak_id
                                                              )
                                                          )
                                                      } else {
                                                          return -1
                                                      }
                                                  } else {
                                                      if (
                                                          courseOrder.includes(
                                                              b.vak_id
                                                          )
                                                      ) {
                                                          return 1
                                                      } else {
                                                          return 0
                                                      }
                                                  }
                                              })}
                                          pinnedCourses={pinnedCourses}
                                          archiveCourse={archiveCourse}
                                          pinCourse={pinCourse}
                                      />,
                                      <ArchivedView
                                          isStudent={role == 'student'}
                                          archivedCourses={courses
                                              .filter(
                                                  (course) =>
                                                      course.gearchiveerd
                                              )
                                              .sort((a: Course, b: Course) => {
                                                  if (
                                                      courseOrder.includes(
                                                          a.vak_id
                                                      )
                                                  ) {
                                                      if (
                                                          courseOrder.includes(
                                                              b.vak_id
                                                          )
                                                      ) {
                                                          return (
                                                              courseOrder.indexOf(
                                                                  a.vak_id
                                                              ) -
                                                              courseOrder.indexOf(
                                                                  b.vak_id
                                                              )
                                                          )
                                                      } else {
                                                          return -1
                                                      }
                                                  } else {
                                                      if (
                                                          courseOrder.includes(
                                                              b.vak_id
                                                          )
                                                      ) {
                                                          return 1
                                                      } else {
                                                          return 0
                                                      }
                                                  }
                                              })}
                                          pinnedCourses={pinnedCourses}
                                          pinCourse={pinCourse}
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
                        <DeadlineCalendar deadlines={deadlines} assignments={assignments} />
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
                            on-click={() => navigator('/addTeacher')}
                            aria-label={'admin-button'}
                            sx={{ margin: 5 }}
                        >
                            {t('add_teacher')}
                        </Button>
                    </Box>
                )}
                <WarningPopup
                    title={t('archive_course_warning')}
                    content={t('will_archive_projects')}
                    buttonName={t('archive')}
                    open={openArchivePopup}
                    handleClose={() => setOpenArchivePopup(false)}
                    doAction={doArchive}
                />
            </Stack>
        </>
    )
}
