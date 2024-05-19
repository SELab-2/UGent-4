import { useState } from 'react'
import { darken } from '@mui/system'
import { Box, Collapse, Tooltip, Typography } from '@mui/material'
import { Button } from './CustomComponents.tsx'
import { AssignmentTurnedIn, ContentPaste } from '@mui/icons-material'
import { t } from 'i18next'
import theme from '../Theme.ts'

interface CopyToClipboardProps {
    invitationLink: string
}

export const CopyToClipboard = ({ invitationLink }: CopyToClipboardProps) => {
    //variable for invitation link clipboard copy and variable
    const [isCopied, setIsCopied] = useState(false)

    async function copyToClipboard() {
        await navigator.clipboard.writeText(invitationLink)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                gap={1}
            >
                <Tooltip
                    title={isCopied ? t('copied') : t('copy')}
                    placement="top"
                >
                    <Collapse
                        in={!isCopied}
                        orientation={'horizontal'}
                        collapsedSize={40}
                        sx={{
                            borderRadius: 2,
                        }}
                    >
                        <Button
                            onClick={copyToClipboard}
                            sx={{
                                maxWidth: 500,
                                minWidth: 200,
                                backgroundColor: 'secondary.main',
                                color: 'text.primary',
                                textTransform: 'none',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 0,
                                gap: 1,
                                '&:hover': {
                                    backgroundColor: darken(
                                        theme.palette.secondary.main,
                                        0.2
                                    ),
                                },
                            }}
                        >
                            <Box
                                padding={1}
                                borderRadius={2}
                                width={24}
                                height={24}
                                display={'flex'}
                                flexDirection={'row'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                bgcolor={'primary.main'}
                            >
                                {isCopied ? (
                                    <AssignmentTurnedIn
                                        sx={{ color: 'background.default' }}
                                    />
                                ) : (
                                    <ContentPaste
                                        sx={{ color: 'background.default' }}
                                    />
                                )}
                            </Box>
                            <Typography
                                variant={'body2'}
                                sx={{
                                    padding: 1,
                                    textAlign: 'left',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {t('copy_invite')}
                            </Typography>
                        </Button>
                    </Collapse>
                </Tooltip>
            </Box>
        </>
    )
}
