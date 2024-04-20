import {
    DateCalendar,
    DayCalendarSkeleton,
    PickersDay,
    PickersDayProps,
} from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { Badge, SxProps } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AssignmentIcon from '@mui/icons-material/Assignment'

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
                isSelected ? (
                    <AssignmentIcon color={'primary'} fontSize={'small'} />
                ) : undefined
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

interface DeadlineCalendarProps {
    deadlines: Dayjs[]
}

export function DeadlineCalendar({ deadlines }: DeadlineCalendarProps) {
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

    return (
        <>
            {/*Calendar*/}
            <DateCalendar
                readOnly={true}
                value={value}
                onChange={(newValue) => setValue(newValue)}
                onMonthChange={(newValue) => handleMonthChange(newValue)}
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
        </>
    )
}

const dateStyle: SxProps = {
    '& .MuiPickersDay-root.Mui-selected': {
        color: 'text.primary',
        backgroundColor: 'secondary.main',
    },
    '& .MuiPickersDay-root.Mui-selected:hover': {
        backgroundColor: 'secondary.main',
    },
}
