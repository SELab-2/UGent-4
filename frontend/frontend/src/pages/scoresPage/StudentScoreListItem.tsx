import { Divider } from '../../components/CustomComponents.tsx'
import {
    CircularProgress,
    Divider,
    IconButton,
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
    const downloadSubmission = () => {
        try {
            instance
                .get(
                    `/indieningen/${lastSubmission?.indiening_id}/indiening_bestanden/`,
                    { responseType: 'blob' }
                )
                .then((res) => {
                    let filename = 'lege_indiening.zip'
                    if (lastSubmission === undefined) return
                    if (lastSubmission.indiening_bestanden.length > 0) {
                        filename =
                            lastSubmission.indiening_bestanden[0].bestand.replace(
                                /^.*[\\/]/,
                                ''
                            )
                    }
                    const blob = new Blob([res.data], {
                        type: res.headers['content-type'],
                    })
                    const file: File = new File([blob], filename, {
                        type: res.headers['content-type'],
                    })
                    const url = window.URL.createObjectURL(file)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = filename
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <ListItem key={key} sx={{ margin: 0 }} disablePadding={true}>
                {/* Inner list item for displaying submission details */}
                <ListItem
                    sx={{
                        width: '100%',
                        height: 30,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingX: 1,
                        paddingY: 3,
                        borderRadius: 2,
                    }}
                >
                    {/* Content section */}
                    <>
                        {loading ? (
                            <CircularProgress size={20} color={'primary'} />
                        ) : (
                            <ListItemText
                                sx={{ maxWidth: 200 }}
                                primary={name}
                            />
                        )}
                        <ListItemText
                            sx={{ maxWidth: '30%' }}
                            primary={
                                lastSubmission
                                    ? t('last_submission') +
                                      ' ' +
                                      dayjs(lastSubmission.tijdstip).format(
                                          'DD/MM/YYYY HH:mm'
                                      )
                                    : t('no_submissions')
                            }
                        />
                        {/* Score section */}
                        <ListItem sx={{ maxWidth: '30%' }}>
                            {lastSubmission ? (
                                <>
                                    <Box width={'50px'}>
                                        <TextField
                                            hiddenLabel
                                            defaultValue={score}
                                            onChange={(event) =>
                                                changeScore(
                                                    parseInt(event.target.value)
                                                )
                                            }
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                    <ListItemText primary={'/' + maxScore} />
                                </>
                            ) : (
                                <ListItemText primary={'0/' + maxScore} />
                            )}
                        </ListItem>
                        {/* Button to download submission */}
                        <ListItem sx={{ maxWidth: '4%' }}>
                            <IconButton
                                onClick={downloadSubmission}
                                edge="end"
                                aria-label="download"
                                disabled={lastSubmission == undefined}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </ListItem>
                    </>
                </ListItem>
            </ListItem>
            <Divider color={'text.main'}></Divider>
        </>
    )
}
