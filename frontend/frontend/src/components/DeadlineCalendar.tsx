import {
    DateCalendar,
    DayCalendarSkeleton,
    PickersDay,
    PickersDayProps,
} from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import {
    Badge,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    SxProps,
    Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import { project } from '../pages/mainPage/MainPage.tsx'

/*
 * This component is a calendar that displays deadlines.
 * It uses the DateCalendar component from @mui/x-date-pickers to display the calendar.
 * The calendar is read-only and the user can't select a date.
 * The deadlines are passed as an array of Dayjs objects.
 * The deadlines are displayed as a badge on the day of the deadline.
 */

function fakeFetch(
    date: Dayjs,
    { signal }: { signal: AbortSignal },
    deadlines: Dayjs[]
) {
    return new Promise<{ deadlinesToDisplay: Dayjs[] }>((resolve, reject) => {
        const timeout = setTimeout(() => {
            const deadlinesToDisplay = deadlines.filter(
                (deadline) =>
                    deadline.month() === date.month() &&
                    deadline.year() === date.year()
            )
            resolve({ deadlinesToDisplay })
        }, 500)

        signal.onabort = () => {
            clearTimeout(timeout)
            reject(new DOMException('aborted', 'AbortError'))
        }
    })
}

function ServerDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

    const isSelected =
        !props.outsideCurrentMonth &&
        highlightedDays.indexOf(props.day.date()) >= 0

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={
                isSelected
                    ? props.day.isBefore(dayjs())
                        ?   (
                                <AssignmentIcon color={'secondary'} fontSize={'small'} />
                            )
                        :   (
                                <AssignmentIcon color={'primary'} fontSize={'small'} />
                            )
                    : undefined
            }
        >
            <PickersDay
                {...other}
                outsideCurrentMonth={outsideCurrentMonth}
                day={day}
            />
        </Badge>
    )
}

interface DeadlineMenuProps {
    assignments: project[]
    selectedDay: Dayjs | null
}

function DeadlineMenu({ assignments, selectedDay }: DeadlineMenuProps) {
    const navigate = useNavigate()

    const handleProjectClick = (courseId: number, projectId: number) => {
        console.log('Project clicked')
        navigate(`/course/${courseId}/assignment/${projectId}`)
    }

    return (
        <Stack
            direction={'column'}
            spacing={1}
            width={'100%'}
            alignItems={'center'}
        >
            <Typography color={'text.primary'}>
                {t('deadlines_on')}: {selectedDay?.format('DD/MM/YYYY')}
            </Typography>
            <List sx={{ width: '100%' }}>
                {assignments.filter((assignment: project) => {
                    return dayjs(assignment.deadline).isSame(selectedDay, 'day')
                }).length === 0 && (
                    <ListItem>
                        <ListItemText>
                            <Typography
                                textAlign={'center'}
                                color={'text.primary'}
                            >
                                {t('no_deadline') + 's'}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                )}
                {assignments
                    .filter((assignment: project) =>
                        dayjs(assignment.deadline).isSame(selectedDay, 'day')
                    )
                    .map((assignment: project) => (
                        <ListItem>
                            <ListItemButton
                                sx={{
                                    border: 0.5,
                                    borderColor: 'primary.main',
                                    textAlign: 'center',
                                    width: '100%',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                }}
                                onClick={() =>
                                    handleProjectClick(
                                        assignment.vak,
                                        assignment.project_id
                                    )
                                }
                            >
                                <ListItemText sx={{ maxWidth: '100%' }}>
                                    <Typography
                                        textOverflow={'ellipsis'}
                                        color={'text.primary'}
                                    >
                                        {assignment.titel}
                                    </Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
        </Stack>
    )
}

interface DeadlineCalendarProps {
    deadlines: Dayjs[]
    assignments: project[]
}

export function DeadlineCalendar({
    deadlines,
    assignments,
}: DeadlineCalendarProps) {
    const requestAbortController = useRef<AbortController | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [highlightedDays, setHighlightedDays] = useState<number[]>([])
    const [value, setValue] = useState<Dayjs | null>(dayjs())

    const fetchHighlightedDays = (date: Dayjs) => {
        const controller = new AbortController()
        fakeFetch(
            date,
            {
                signal: controller.signal,
            },
            deadlines
        )
            .then(({ deadlinesToDisplay }) => {
                setHighlightedDays(
                    deadlinesToDisplay.map((deadline) => deadline.date())
                )
                setIsLoading(false)
            })
            .catch((error: Error) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') {
                    throw error
                }
            })

        requestAbortController.current = controller
    }

    useEffect(() => {
        fetchHighlightedDays(dayjs())
        // abort request on unmount
        return () => requestAbortController.current?.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadlines])

    const handleMonthChange = (date: Dayjs) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort()
        }

        setIsLoading(true)
        setHighlightedDays([])
        fetchHighlightedDays(date)
    }

    const handleYearChange = (date: Dayjs) => {
        setIsLoading(true)
        setHighlightedDays([])
        fetchHighlightedDays(date)
    }

    return (
        <>
            <Stack direction={'column'}>
                {/*Calendar*/}
                <DateCalendar
                    readOnly={false}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    onMonthChange={(newValue) => handleMonthChange(newValue)}
                    onYearChange={(newValue) => handleYearChange(newValue)}
                    renderLoading={() => <DayCalendarSkeleton />}
                    loading={isLoading}
                    sx={dateStyle}
                    slots={{
                        day: ServerDay,
                    }}
                    slotProps={{
                        day: {
                            highlightedDays,
                        } as never,
                    }}
                />
                <DeadlineMenu assignments={assignments} selectedDay={value} />
            </Stack>
        </>
    )
}

const dateStyle: SxProps = {
    '& .MuiPickersDay-root.Mui-selected': {
        color: 'secondary.contrastText',
        backgroundColor: 'secondary.main',
    },
    '& .MuiPickersDay-root.Mui-selected:hover': {
        color: 'secondary.contrastText',
        backgroundColor: 'secondary.main',
    },
    '& .MuiPickersDay-root.Mui-selected:not(hover)': {
        color: 'secondary.contrastText',
        backgroundColor: 'secondary.main',
    },
}
