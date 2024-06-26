import {
    Box,
    CircularProgress,
    Dialog,
    ListItem,
    ListItemText,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useEffect, useState } from 'react'
import { Header } from '../../components/Header.tsx'
import { t } from 'i18next'
import {
    Button,
    Card,
    Divider,
    EvenlySpacedRow,
} from '../../components/CustomComponents.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../axiosConfig.ts'
import { User } from '../subjectsPage/AddChangeSubjectPage.tsx'

export interface Group {
    groep_id: number
    studenten: number[]
    project: number
}

export interface Assignment {
    project_id: number
    titel: string
    beschrijving: string
    opgave_bestand: string
    vak: number
    max_score: number
    max_groep_grootte: number
    deadline: string | null
    extra_deadline: string | null
    zichtbaar: boolean
    gearchiveerd: boolean
    file?: File
}

function joinLeaveButton(
    isin: boolean,
    disabled: boolean,
    handleJoin: () => void,
    handleLeave: () => void
) {
    if (isin) {
        return (
            <>
                <Button id='leaveGroup' size={'small'} onClick={handleLeave}>
                    <Typography>{t('leave')}</Typography>
                </Button>
            </>
        )
    }
    if (disabled) {
        return (
            <>
                <Typography>{t('group_full')}</Typography>
            </>
        )
    }
    return (
        <>
            <Button id= 'joinGroup' size={'small'} onClick={handleJoin}>
                <Typography>{t('join_group')}</Typography>
            </Button>
        </>
    )
}

export function ChooseGroup() {
    const params = useParams()
    const navigate = useNavigate()

    const [studenten, setStudenten] = useState<Record<number, User>>({})
    const [groups, setGroups] = useState<Group[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [user, setUser] = useState<User>()
    const [assignment, setAssignment] = useState<Assignment>()

    const [loading, setLoading] = useState(true)
    const [userLoading, setUserLoading] = useState(true)

    const assignmentId = params.assignmentId
    const courseid = params.courseId

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setUserLoading(true)
            try {
                const user = await instance.get('/gebruikers/me/')
                setUser(user.data)
                setUserLoading(false)

                const assignment = await instance.get(
                    '/projecten/' + assignmentId + '/'
                )
                setAssignment(assignment.data)

                const course = await instance.get('vakken/' + courseid)
                for (let i = 0; i < course.data.studenten.length; i++) {
                    const studentid = course.data.studenten[i]
                    const student = await instance.get(
                        'gebruikers/' + studentid
                    )
                    setStudenten((oldstudenten) => {
                        return {
                            ...oldstudenten,
                            [student.data.user]: student.data,
                        }
                    })
                }
                const groups = await instance.get<Group[]>(
                    'groepen/?project=' + assignmentId
                )
                const sortedGroups = groups.data.sort((a: Group, b: Group) => {
                    return a.groep_id - b.groep_id
                })

                setGroups(sortedGroups)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData().catch((err) => console.error(err))
    }, [assignmentId, courseid])

    return (
        <>
            {/* Rendering different UI based on user role */}
            {userLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress
                        color={'primary'}
                        data-cy="loadingAnimation"
                    />
                    <Box></Box>
                </Box>
            ) : (
                <>
                    {!user?.is_lesgever ? (
                        // Rendering UI for teacher
                        <>
                            <Stack direction={'column'}>
                                <Header
                                    variant={'not_main'}
                                    title={
                                        loading
                                            ? ''
                                            : `${assignment?.titel}: ${t('groups')}`
                                    }
                                />
                                <Stack
                                    direction={'column'}
                                    spacing={1}
                                    marginTop={11}
                                    sx={{
                                        width: '100%',
                                        height: '70 %',
                                        backgroundColor: 'background.default',
                                    }}
                                >
                                    <Card>
                                        <Box
                                            aria-label={'courseHeader'}
                                            sx={{
                                                backgroundColor:
                                                    'secondary.main',
                                                height: 20,
                                                padding: 3,
                                            }}
                                        >
                                            <EvenlySpacedRow
                                                items={[
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {t('group_number')}
                                                    </Typography>,
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {t('members')}
                                                    </Typography>,
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    ></Typography>,
                                                ]}
                                            />
                                        </Box>
                                        <List
                                            disablePadding={true}
                                            sx={{
                                                '& > :not(style)': {
                                                    marginBottom: '8px',
                                                },
                                            }}
                                        >
                                            {loading ? (
                                                [...Array(3)].map(() => (
                                                    <Skeleton
                                                        variant={'text'}
                                                        height={30}
                                                        width={'100%'}
                                                    />
                                                ))
                                            ) : (
                                                <>
                                                    {groups.map(
                                                        (group: Group) => {
                                                            //const group=getGroup(id)

                                                            const handleJoin =
                                                                () => {
                                                                    setGroups(
                                                                        (
                                                                            oldGroups
                                                                        ): Group[] => {
                                                                            if (
                                                                                user ==
                                                                                undefined
                                                                            ) {
                                                                                return oldGroups
                                                                            }
                                                                            if (
                                                                                assignment ==
                                                                                undefined
                                                                            ) {
                                                                                return oldGroups
                                                                            }

                                                                            let j = 0

                                                                            let edittedgroup =
                                                                                undefined

                                                                            for (
                                                                                let i = 0;
                                                                                i <
                                                                                oldGroups.length;
                                                                                i++
                                                                            ) {
                                                                                if (
                                                                                    oldGroups[
                                                                                        i
                                                                                    ].studenten.includes(
                                                                                        user.user
                                                                                    )
                                                                                ) {
                                                                                    const newgroup1 =
                                                                                        {
                                                                                            groep_id:
                                                                                                oldGroups[
                                                                                                    i
                                                                                                ]
                                                                                                    .groep_id,
                                                                                            project:
                                                                                                oldGroups[
                                                                                                    i
                                                                                                ]
                                                                                                    .project,
                                                                                            studenten:
                                                                                                oldGroups[
                                                                                                    i
                                                                                                ].studenten.filter(
                                                                                                    (
                                                                                                        student
                                                                                                    ) =>
                                                                                                        student !=
                                                                                                        user.user
                                                                                                ),
                                                                                        }

                                                                                    instance
                                                                                        .patch(
                                                                                            'groepen/' +
                                                                                                oldGroups[
                                                                                                    i
                                                                                                ]
                                                                                                    .groep_id +
                                                                                                '/',
                                                                                            {
                                                                                                studenten:
                                                                                                    oldGroups[
                                                                                                        i
                                                                                                    ].studenten.filter(
                                                                                                        (
                                                                                                            student
                                                                                                        ) =>
                                                                                                            student !=
                                                                                                            user.user
                                                                                                    ),
                                                                                            }
                                                                                        )
                                                                                        .catch(
                                                                                            (
                                                                                                err
                                                                                            ) => {
                                                                                                console.log(
                                                                                                    err
                                                                                                )
                                                                                            }
                                                                                        )
                                                                                    j =
                                                                                        i
                                                                                    edittedgroup =
                                                                                        newgroup1
                                                                                }
                                                                            }

                                                                            for (
                                                                                let i = 0;
                                                                                i <
                                                                                oldGroups.length;
                                                                                i++
                                                                            ) {
                                                                                if (
                                                                                    oldGroups[
                                                                                        i
                                                                                    ]
                                                                                        .groep_id ==
                                                                                    group.groep_id
                                                                                ) {
                                                                                    if (
                                                                                        group
                                                                                            .studenten
                                                                                            .length >=
                                                                                        assignment.max_groep_grootte
                                                                                    ) {
                                                                                        return oldGroups
                                                                                    }
                                                                                    const newgroup =
                                                                                        {
                                                                                            groep_id:
                                                                                                group.groep_id,
                                                                                            project:
                                                                                                group.project,
                                                                                            studenten:
                                                                                                [
                                                                                                    ...group.studenten,
                                                                                                    user.user,
                                                                                                ],
                                                                                        }
                                                                                    instance
                                                                                        .patch(
                                                                                            'groepen/' +
                                                                                                group.groep_id +
                                                                                                '/',
                                                                                            {
                                                                                                studenten:
                                                                                                    [
                                                                                                        ...group.studenten,
                                                                                                        user.user,
                                                                                                    ],
                                                                                            }
                                                                                        )
                                                                                        .catch(
                                                                                            (
                                                                                                err
                                                                                            ) => {
                                                                                                console.log(
                                                                                                    err
                                                                                                )
                                                                                            }
                                                                                        )

                                                                                    if (
                                                                                        edittedgroup !=
                                                                                        undefined
                                                                                    ) {
                                                                                        if (
                                                                                            i <
                                                                                            j
                                                                                        ) {
                                                                                            return [
                                                                                                ...oldGroups.slice(
                                                                                                    0,
                                                                                                    i
                                                                                                ),
                                                                                                newgroup,
                                                                                                ...oldGroups.slice(
                                                                                                    i +
                                                                                                        1,
                                                                                                    j
                                                                                                ),
                                                                                                edittedgroup,
                                                                                                ...oldGroups.slice(
                                                                                                    j +
                                                                                                        1
                                                                                                ),
                                                                                            ].sort(
                                                                                                (
                                                                                                    a,
                                                                                                    b
                                                                                                ) => {
                                                                                                    return (
                                                                                                        a.groep_id -
                                                                                                        b.groep_id
                                                                                                    )
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        return [
                                                                                            ...oldGroups.slice(
                                                                                                0,
                                                                                                j
                                                                                            ),
                                                                                            edittedgroup,
                                                                                            ...oldGroups.slice(
                                                                                                j +
                                                                                                    1,
                                                                                                i
                                                                                            ),
                                                                                            newgroup,
                                                                                            ...oldGroups.slice(
                                                                                                i +
                                                                                                    1
                                                                                            ),
                                                                                        ].sort(
                                                                                            (
                                                                                                a,
                                                                                                b
                                                                                            ) => {
                                                                                                return (
                                                                                                    a.groep_id -
                                                                                                    b.groep_id
                                                                                                )
                                                                                            }
                                                                                        )
                                                                                    }

                                                                                    return [
                                                                                        ...oldGroups.slice(
                                                                                            0,
                                                                                            i
                                                                                        ),
                                                                                        newgroup,
                                                                                        ...oldGroups.slice(
                                                                                            i +
                                                                                                1
                                                                                        ),
                                                                                    ].sort(
                                                                                        (
                                                                                            a,
                                                                                            b
                                                                                        ) => {
                                                                                            return (
                                                                                                a.groep_id -
                                                                                                b.groep_id
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            }
                                                                            return oldGroups
                                                                        }
                                                                    )
                                                                }

                                                            const handleLeave =
                                                                () => {
                                                                    setGroups(
                                                                        (
                                                                            oldGroups
                                                                        ) => {
                                                                            if (
                                                                                user ==
                                                                                undefined
                                                                            ) {
                                                                                return oldGroups
                                                                            }
                                                                            for (
                                                                                let i = 0;
                                                                                i <
                                                                                oldGroups.length;
                                                                                i++
                                                                            ) {
                                                                                if (
                                                                                    oldGroups[
                                                                                        i
                                                                                    ]
                                                                                        .groep_id ==
                                                                                    group.groep_id
                                                                                ) {
                                                                                    const newgroup =
                                                                                        {
                                                                                            groep_id:
                                                                                                group.groep_id,
                                                                                            project:
                                                                                                group.project,
                                                                                            studenten:
                                                                                                group.studenten.filter(
                                                                                                    (
                                                                                                        student
                                                                                                    ) =>
                                                                                                        student !=
                                                                                                        user.user
                                                                                                ),
                                                                                        }
                                                                                    instance
                                                                                        .patch(
                                                                                            'groepen/' +
                                                                                                group.groep_id +
                                                                                                '/',
                                                                                            {
                                                                                                studenten:
                                                                                                    group.studenten.filter(
                                                                                                        (
                                                                                                            student
                                                                                                        ) =>
                                                                                                            student !=
                                                                                                            user.user
                                                                                                    ),
                                                                                            }
                                                                                        )
                                                                                        .catch(
                                                                                            (
                                                                                                err
                                                                                            ) => {
                                                                                                console.log(
                                                                                                    err
                                                                                                )
                                                                                            }
                                                                                        )

                                                                                    return [
                                                                                        ...oldGroups.slice(
                                                                                            0,
                                                                                            i
                                                                                        ),
                                                                                        newgroup,
                                                                                        ...oldGroups.slice(
                                                                                            i +
                                                                                                1
                                                                                        ),
                                                                                    ].sort(
                                                                                        (
                                                                                            a,
                                                                                            b
                                                                                        ) => {
                                                                                            return (
                                                                                                a.groep_id -
                                                                                                b.groep_id
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            }
                                                                            return oldGroups
                                                                        }
                                                                    )
                                                                }

                                                            return (
                                                                <>
                                                                    <Divider />
                                                                    <ListItem
                                                                        sx={{
                                                                            width: '100%',
                                                                            minheight: 30,
                                                                        }}
                                                                    >
                                                                        <EvenlySpacedRow
                                                                            items={[
                                                                                <ListItemText
                                                                                    primary={
                                                                                        groups.indexOf(
                                                                                            group
                                                                                        ) +
                                                                                        1
                                                                                    }
                                                                                />,
                                                                                <Box
                                                                                    display={
                                                                                        'flex'
                                                                                    }
                                                                                    flexDirection={
                                                                                        'column'
                                                                                    }
                                                                                >
                                                                                    {loading ? (
                                                                                        <Typography>
                                                                                            {t(
                                                                                                'members_loading'
                                                                                            )}
                                                                                        </Typography>
                                                                                    ) : (
                                                                                        <>
                                                                                            {group
                                                                                                .studenten
                                                                                                .length >
                                                                                            0 ? (
                                                                                                group.studenten.map(
                                                                                                    (
                                                                                                        studentid
                                                                                                    ) => {
                                                                                                        const student =
                                                                                                            studenten[
                                                                                                                studentid
                                                                                                            ]
                                                                                                        if (
                                                                                                            student
                                                                                                        ) {
                                                                                                            console.log(
                                                                                                                'Student:',
                                                                                                                student
                                                                                                            )
                                                                                                            return (
                                                                                                                <Typography
                                                                                                                    key={
                                                                                                                        studentid
                                                                                                                    }
                                                                                                                >
                                                                                                                    {student.first_name +
                                                                                                                        ' ' +
                                                                                                                        student.last_name}
                                                                                                                </Typography>
                                                                                                            )
                                                                                                        }
                                                                                                        return null
                                                                                                    }
                                                                                                )
                                                                                            ) : (
                                                                                                <Typography>
                                                                                                    {t(
                                                                                                        'no_members_yet'
                                                                                                    )}
                                                                                                </Typography>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </Box>,
                                                                                <>
                                                                                    {joinLeaveButton(
                                                                                        user !=
                                                                                            undefined
                                                                                            ? group.studenten.includes(
                                                                                                  user.user
                                                                                              )
                                                                                            : false,
                                                                                        group
                                                                                            .studenten
                                                                                            .length ===
                                                                                            assignment?.max_groep_grootte &&
                                                                                            !(user !=
                                                                                            undefined
                                                                                                ? group.studenten.includes(
                                                                                                      user.user
                                                                                                  )
                                                                                                : false),
                                                                                        handleJoin,
                                                                                        handleLeave
                                                                                    )}
                                                                                </>,
                                                                            ]}
                                                                        />
                                                                    </ListItem>
                                                                </>
                                                            )
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </List>

                                        <Dialog
                                            onClose={handleClose}
                                            open={open}
                                        >
                                            <Box
                                                padding={2}
                                                alignItems={'center'}
                                                gap={1}
                                            >
                                                <Typography>
                                                    {' '}
                                                    {'placeholder'}{' '}
                                                </Typography>
                                            </Box>
                                        </Dialog>
                                    </Card>
                                </Stack>
                            </Stack>
                        </>
                    ) : (
                        navigate('*')
                    )}
                </>
            )}
        </>
    )
}
