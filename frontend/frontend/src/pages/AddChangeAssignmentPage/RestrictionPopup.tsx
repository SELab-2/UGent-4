import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {ChangeEvent, FormEvent} from "react";
import {t} from "i18next";
import {Autocomplete, Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadButton from "../../components/FileUploadButton";
import {restriction} from './AddChangeAssignmentPage.tsx'

/**
 * Component for adding restrictions to an assignment
 * @param open - boolean for opening the dialog
 * @param setOpen - function for setting the open state
 * @param type - type of restriction
 * @param setType - function for setting the type of restriction
 * @param dockerfile - dockerfile for dockerTest restriction
 * @param setDockerFile - function for setting the dockerfile
 * @param allowedFileTypes - allowed file types for fileType restriction
 * @param setAllowedFileTypes - function for setting the allowed file types
 * @param maxSize - maximum file size for fileSize restriction
 * @param setMaxSize - function for setting the maximum file size
 */

export type restrictionType = 'dockerTest' | 'fileSize' | 'fileType';

interface RestrictionPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    type: restrictionType;
    setType: (type: restrictionType) => void;
    dockerfile?: File;
    setDockerFile?: (dockerfile: File) => void;
    allowedFileTypes?: string[];
    setAllowedFileTypes?: (allowedFileTypes: string[]) => void;
    maxSize?: number;
    setMaxSize?: (maxSize: number) => void;
    setRestriction: (restriction: restriction) => void;

}

export default function RestrictionPopup({
                                             open,
                                             setOpen,
                                             type,
                                             setType,
                                             dockerfile,
                                             setDockerFile,
                                             allowedFileTypes,
                                             setAllowedFileTypes,
                                             maxSize,
                                             setMaxSize,
                                             setRestriction
                                         }: RestrictionPopupProps) {

    const handleClose = () => {
        setOpen(false);
    };

    const setFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (setDockerFile) {
                setDockerFile(event.target.files[0]);
            }
            console.log(dockerfile?.name);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault()
                        let restriction: restriction
                        if (type === 'dockerTest') {
                            restriction = {type, value: dockerfile}
                        } else if (type === 'fileSize') {
                            restriction = {type: type, value: maxSize}
                        } else {
                            restriction = {type: type, value: allowedFileTypes}
                        }
                        setRestriction(restriction)
                        handleClose();
                    },
                }}
            >
                <DialogTitle>{t('add_restriction')}</DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={"column"} gap={1} aria-label={"content"}>
                        <Box display={'flex'} flexDirection={"column"} gap={1} aria-label={"type"}>
                            <Box display={'flex'} flexDirection={"column"} gap={1}>
                                <Typography>{t('restrictiontype')}</Typography>
                                <Select onChange={(event) => setType(event.target.value as restrictionType)}
                                        label={t('restrictionType')}
                                        autoWidth
                                        name={'restrictionType'}
                                        value={type}
                                >
                                    {['dockerTest', 'fileSize', 'fileType'].map((type) => (
                                        <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            {type === 'dockerTest' && (<>
                                <Typography>{t('dockerfile')}</Typography>
                                <FileUploadButton name={'Upload Docker container'}
                                                  fileTypes={['.tar']}
                                                  tooltip={t('upload_container')}
                                                  onFileChange={setFile}
                                                  path={dockerfile ? dockerfile : undefined}

                                />
                            </>)}
                            {type === 'fileSize' && (<>
                                <Typography>{t('maxSize')}</Typography>
                                <TextField
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">mb</InputAdornment>,
                                    }}
                                    type={'number'}
                                    value={maxSize}
                                    onChange={(event) => setMaxSize ? setMaxSize(parseInt(event.target.value)) : undefined}
                                />
                            </>)}
                            {type === 'fileType' && (<>
                                <Typography>{t('allowed_file_types')}</Typography>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={['.zip', '.pdf', '.tar', '.java', '.py', '.c', '.cpp', '.h', '.hpp', '.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.jsx', '.tsx']}
                                    getOptionLabel={(option) => option}
                                    defaultValue={allowedFileTypes}
                                    freeSolo
                                    filterSelectedOptions
                                    limitTags={2}
                                    onChange={(_, value) => setAllowedFileTypes ? setAllowedFileTypes(value) : undefined}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="filterSelectedOptions"
                                            placeholder={t('fileType')}
                                        />
                                    )}
                                />
                            </>)}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={handleClose}><CancelIcon/></IconButton>
                    <IconButton type="submit"><CheckIcon/></IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
}