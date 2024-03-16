import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {ChangeEvent} from "react";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {t} from "i18next";
import ClearIcon from '@mui/icons-material/Clear';

const VisuallyHiddenInput = styled('input')({
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface InputFileUploadProps {
    name: string;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    fileTypes: string[];
    path: File | undefined;
}

export default function InputFileUpload({name, fileTypes, path, onFileChange}: InputFileUploadProps) {
    const clearFile = () => {
        const dt = new DataTransfer();
        onFileChange({target: {files: dt.files}} as unknown as ChangeEvent<HTMLInputElement>);
    }

    return (
        <>
            <Tooltip title={t('uploadToolTip')}>
                <Button variant={"contained"} color={"secondary"} size={'small'}
                        startIcon={<UploadFileIcon/>}
                        disableElevation
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        sx={{
                            borderRadius: 2,
                            padding: 1,
                        }}
                >
                    {name}
                    <VisuallyHiddenInput type="file" value={path === undefined ? "" : path.webkitRelativePath}
                                         accept={fileTypes.join(',')}
                                         multiple={false}
                                         onChange={onFileChange}
                    />
                </Button>
            </Tooltip>
            <Box aria-label={'filename'} padding={2} display={'flex'} flexDirection={'row'} alignItems={'center'}
                 gap={1}>
                <Typography variant={'caption'} maxWidth={160} noWrap={true}
                            color={"text.secondary"}>{path ? path.name : t('noFile')}</Typography>
                <IconButton aria-label={'delete_file'} size={'small'} onClick={clearFile}
                            sx={{marginBottom: 1}}>
                    <ClearIcon color={'error'}/>
                </IconButton>
            </Box>
        </>
    );
}