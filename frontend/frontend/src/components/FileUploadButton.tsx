import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
    fileTypes: string[];
    path: string;
    multiple?: boolean;
}

export default function InputFileUpload({name, fileTypes, path, multiple}: InputFileUploadProps) {
    return (
        <Button variant={"contained"} color={"secondary"} size={'small'}
                startIcon={<UploadFileIcon/>}
                disableElevation
                component="label"
                role={undefined}
                tabIndex={-1}
                sx={{
                    marginRight: 3,
                    padding: 2,
                }}
        >
            {name}
            <VisuallyHiddenInput type="file" value={path} accept={fileTypes.join(',')}
                                 multiple={multiple}/>
        </Button>
    );
}