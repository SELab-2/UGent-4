import { Divider, EvenlySpacedRow } from '../../components/CustomComponents.tsx'
import {
    CircularProgress,
    ListItemIcon,
    ListItem,
    ListItemText,
    TextField,
    Box,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import instance from '../../axiosConfig'
import { Indiening } from './ProjectScoresPage.tsx'
import dayjs from 'dayjs'

interface StudentScoreListItemProps {
    key: number
    groupNumber: number
    studenten: number[]
    lastSubmission: Indiening | undefined
    score: number | undefined
    maxScore: number
    changeScore: (score: number) => void
}

export function StudentScoreListItem({
    key,
    groupNumber,
    studenten,
    lastSubmission,
    score,
    maxScore,
    changeScore,
}: StudentScoreListItemProps) {
    const [name, setName] = useState(t('group') + ' ' + groupNumber)
    // state for loaders
    const [loading, setLoading] = useState(true)

    // Get all necessary data
    useEffect(() => {
        async function fetchName() {
            setLoading(true)
            if (studenten.length == 1) {
                const studentId = studenten[0]
                const studentResponse = await instance.get(
                    `/gebruikers/${studentId}/`
                )
                setName(
                    studentResponse.data.first_name +
                        ' ' +
                        studentResponse.data.last_name
                )
            }
            setLoading(false)
        }

        fetchName().catch((e) => console.error(e))
    }, [studenten])

    // Function to download a single submission
    const downloadSubmission = async () => {
        try {
            let filename = 'lege_indiening.zip'
            // Get the submission details
            const submissionResponse = await instance.get(
                `/indieningen/${lastSubmission?.indiening_id}/`
            )
            const newSubmission = submissionResponse.data
            // Get the submission file
            const fileResponse = await instance.get(
                `/indieningen/${lastSubmission?.indiening_id}/indiening_bestand/`,
                { responseType: 'blob' }
            )
            if (newSubmission.bestand) {
                filename = newSubmission.bestand.replace(/^.*[\\/]/, '')
            }
            const blob = new Blob([fileResponse.data], {
                type: fileResponse.headers['content-type'],
            })
            const file = new File([blob], filename, {
                type: fileResponse.headers['content-type'],
            })
            const url = window.URL.createObjectURL(file)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <ListItem key={key} sx={{ maxHeight: '35px' }} disablePadding>
                {/* Inner list item for displaying submission details */}
                <ListItem>
                    {/* Content section */}
                    <>
                        {loading ? (
                            <CircularProgress
                                size={20}
                                color={'primary'}
                                data-cy="loadingAnimation"
                            />
                        ) : (
                            <EvenlySpacedRow
                                items={[
                                    <ListItemText
                                        sx={{ maxWidth: 200 }}
                                        primary={name}
                                    />,
                                    <ListItemText
                                        primary={
                                            lastSubmission
                                                ? t('last_submission') +
                                                  ' ' +
                                                  dayjs(
                                                      lastSubmission.tijdstip
                                                  ).format('DD/MM/YYYY HH:mm')
                                                : t('no_submissions')
                                        }
                                    />,
                                    <ListItem>
                                        {lastSubmission ? (
                                            <>
                                                <Box
                                                    width={'24px'}
                                                    height={'25px'}
                                                >
                                                    <TextField
                                                        hiddenLabel
                                                        defaultValue={score}
                                                        onChange={(event) =>
                                                            changeScore(
                                                                parseInt(
                                                                    event.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        variant="standard"
                                                        size="small"
                                                    />
                                                </Box>
                                                <ListItemText
                                                    primary={'/' + maxScore}
                                                />
                                            </>
                                        ) : (
                                            <ListItemText
                                                primary={'0/' + maxScore}
                                            />
                                        )}
                                    </ListItem>,
                                    <ListItemText>
                                        <ListItemIcon>
                                            <div onClick={downloadSubmission}>
                                                {lastSubmission ? (
                                                    <DownloadIcon
                                                        sx={{
                                                            color: 'primary.main',
                                                            '&:hover': {
                                                                color: 'primary.light',
                                                            },
                                                        }}
                                                    />
                                                ) : (
                                                    <DownloadIcon
                                                        sx={{ color: 'gray' }}
                                                    />
                                                )}
                                            </div>
                                        </ListItemIcon>
                                    </ListItemText>,
                                ]}
                            />
                        )}
                    </>
                </ListItem>
            </ListItem>
            <Divider color={'text.main'}></Divider>
        </>
    )
}
