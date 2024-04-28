import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { ChangeEvent } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { t } from 'i18next'
import ClearIcon from '@mui/icons-material/Clear'

/*
 * This component is used to create a button to upload a file.
 * @parram {string} name - The name of the button
 * @parram {string} tooltip - The tooltip of the button
 * @parram {function} onFileChange - The function to call when the file is changed
 * @parram {string[]} fileTypes - The allowed file types
 * @parram {File | undefined} path - The path of the file
 * @return {JSX.Element} - The button to upload a file
 */

const VisuallyHiddenInput = styled('input')({
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

interface InputFileUploadProps {
    name: string
    tooltip: string
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    fileTypes: string[]
    path: File | undefined
}

export default function InputFileUpload({
    name,
    fileTypes,
    path,
    onFileChange,
    tooltip,
}: InputFileUploadProps) {
    // Function to clear the selected file
    const clearFile = () => {
        const dt = new DataTransfer()
        onFileChange({
            target: { files: dt.files },
        } as unknown as ChangeEvent<HTMLInputElement>)
    }

    return (
        <>
            <Box
                aria-label={'upload_button'}
                padding={1}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                gap={1}
            >
                {/* Tooltip for the upload button */}
                <Tooltip title={tooltip}>
                    <Button
                        id='uploadButton'
                        variant={'contained'}
                        color={'secondary'}
                        size={'small'}
                        startIcon={<UploadFileIcon color={'info'} />}
                        disableElevation
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        sx={{
                            padding: 1,
                            '& .MuiButton-startIcon': {
                                margin: 0,
                                marginRight: 1,
                            },
                        }}
                    >
                        {/* Hidden input for file selection */}
                        <Typography
                            variant={'body2'}
                            marginTop={0.5}
                            textAlign={'center'}
                        >
                            {name}
                        </Typography>

                        <VisuallyHiddenInput
                            type="file"
                            value={
                                path === undefined
                                    ? ''
                                    : path.webkitRelativePath
                            }
                            accept={fileTypes.join(',')}
                            multiple={false}
                            onChange={onFileChange}
                        />
                    </Button>
                </Tooltip>
                {/* Display selected file name */}
                <Box
                    aria-label={'filename'}
                    padding={0}
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                    gap={1}
                >
                    <Typography
                        variant={'caption'}
                        maxWidth={160}
                        noWrap={true}
                        color={'text.secondary'}
                    >
                        {path ? path.name : t('noFile')}
                    </Typography>
                    {/* Button to clear selected file */}
                    {path && (
                        <IconButton
                            id='clearButton'
                            aria-label={'delete_file'}
                            size={'small'}
                            onClick={clearFile}
                            sx={{ marginBottom: 1 }}
                        >
                            <ClearIcon color={'error'} />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </>
    )
}
