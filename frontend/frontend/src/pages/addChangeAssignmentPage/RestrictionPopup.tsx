import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {t} from "i18next";
import {
    Autocomplete,
    Box,
    FormHelperText,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadButton from "../../components/FileUploadButton";
import {restriction} from './AddChangeAssignmentPage.tsx'

/**
 * Component for adding restrictions to an assignment.
 * The component is a dialog that opens when the user wants to add a restriction to an assignment.
 * Only one restriction can be added at a time.
 * The user can choose between three types of restrictions: dockerTest, fileSize and fileType.
 * The dialog only allows one restriction of each type to be added.
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
 * @param restrictions - list of restrictions
 * @param setRestrictions - function for setting the restrictions
 * @param allowedTypes - list of allowed restriction types
 */

export type restrictionType = 'dockerTest' | 'fileSize' | 'fileType';

interface RestrictionPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    type: restrictionType;
    setType: (type: restrictionType) => void;
    dockerfile?: File;
    setDockerFile?: (dockerfile: File | undefined) => void;
    allowedFileTypes?: string[];
    setAllowedFileTypes?: (allowedFileTypes: string[]) => void;
    maxSize?: number;
    setMaxSize?: (maxSize: number) => void;
    restrictions: restriction[];
    setRestrictions: Dispatch<SetStateAction<restriction[]>>
    allowedTypes: restrictionType[];
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
                                             restrictions,
                                             setRestrictions,
                                             allowedTypes
                                         }: RestrictionPopupProps) {
    //state for submitError, used to check if the required fields are filled
    const [submitError, setSubmitError] = useState<boolean>(false);

    // Function for closing the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Function for setting the dockerfile, required by the uploadbutton component
    const setFile = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (setDockerFile) {
                setDockerFile(event.target.files[0]);
            }
            console.log(dockerfile?.name);
        }
    };

    // Function for submitting the restriction
    // Checks if the restriction is valid by checking if the required fields are filled, if not it sets the submitError
    // to true, and it does not submit the restriction.
    const submitRestriction = (event: formEvent<HTMLFormElement>) => {
        event.preventDefault();
        let restriction: restriction;
        if (type === 'dockerTest') {
            if (!dockerfile) {
                setSubmitError(true)
                return;
            }
            restriction = {type, value: dockerfile}
        } else if (type === 'fileSize') {
            if (!maxSize) {
                setSubmitError(true)
                return;
            }
            restriction = {type: type, value: maxSize}
        } else {
            if (allowedFileTypes?.length === 0) {
                setSubmitError(true)
                return;
            }
            restriction = {type: type, value: allowedFileTypes}
        }

        setRestrictions([...restrictions, restriction]);
        setMaxSize ? setMaxSize(0) : undefined;
        setDockerFile ? setDockerFile(undefined) : undefined;
        setAllowedFileTypes ? setAllowedFileTypes([]) : undefined;
        handleClose();
    }

    // Checks if the required fields are filled, if they are it sets the submitError to false
    // This is used to remove the error message when the user has filled the required fields to prevent annoying the user.
    // Executes when the type, dockerfile, maxSize or allowedFileTypes changes
    useEffect(() => {
        if (type === 'dockerTest' && dockerfile) {
            setSubmitError(false);
        } else if (type === 'fileSize' && maxSize) {
            setSubmitError(false);
        } else if (type === 'fileType' && allowedFileTypes?.length !== 0) {
            setSubmitError(false);
        }
    }, [type, dockerfile, maxSize, allowedFileTypes])

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: submitRestriction,
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
                                    {allowedTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{t(type)}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            {type === 'dockerTest' && (<>
                                <Typography>{t('dockerfile')}</Typography>
                                <FileUploadButton name={'Upload Docker container'}
                                                  fileTypes={['.tar', '.dockerfile']}
                                                  tooltip={t('upload_container')}
                                                  onFileChange={setFile}
                                                  path={dockerfile ? dockerfile : undefined}

                                />
                                {submitError && <FormHelperText error>{t('dockerfile_error')}</FormHelperText>}
                            </>)}
                            {type === 'fileSize' && (<>
                                <Typography>{t('maxSize')}</Typography>
                                <TextField
                                    required
                                    label={t('fileSize')}
                                    error={submitError}
                                    helperText={submitError ? t('is_required') : undefined}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">mb</InputAdornment>,
                                    }}
                                    type={'number'}
                                    value={maxSize ? maxSize : 0}
                                    onChange={(event) => {
                                        if (event.target.value !== '') {
                                            const newSize = Math.max(parseInt(event.target.value), 0);
                                            setMaxSize ? setMaxSize(newSize) : undefined;
                                        } else {
                                            setMaxSize ? setMaxSize(parseInt(event.target.value)) : undefined;
                                        }
                                    }}
                                />
                            </>)}
                            {type === 'fileType' && (<>
                                <Typography>{t('allowed_file_types')}</Typography>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    options={['.zip', '.pdf', '.tar', '.java', '.py', '.c', '.cpp', '.h', '.hpp', '.txt', '.md', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts', '.jsx', '.tsx']}
                                    getOptionLabel={(option) => option}
                                    value={allowedFileTypes}
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
                                {submitError && <FormHelperText error>{t('filetype_error')}</FormHelperText>}
                            </>)}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={handleClose}><CancelIcon/></IconButton>
                    <IconButton disabled={submitError} type="submit"><CheckIcon/></IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
}