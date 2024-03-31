import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { ButtonGroup, TextField } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RestrictionsDialog(){
  const [open, setOpen] = React.useState(false);
    const fileInput = React.useRef<HTMLInputElement>(null);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const buttons = [
        <Button 
                key="Upload"
                onClick={()=> {
                    fileInput.current?.click();
                    /*closeParentDialog();*/
                }}
        >Upload</Button>,
        <Button key="New_Script"
        onClick={() => {
            handleClickOpen();
            /*closeParentDialog();*/}}>New Script</Button>,
        <Button key="FileExtensionCheck"
        onClick={() => {
            handleClickOpen();
            /*closeParentDialog();*/}}>File Extension Check</Button>,
        <Button key="FilesPresentCheck" onClick={() => {
            handleClickOpen();
            /*closeParentDialog();*/}}>Files Present Check</Button>,
    ];

    

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
        <input 
            ref={fileInput} 
            type="file" 
            style={{ display: 'none' }} 
        />
        <ButtonGroup orientation="vertical" aria-label="Vertical button group">
            {buttons}
        </ButtonGroup>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Test code
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        
        <TextField
          id="filled-textarea"
          multiline
          variant="filled"
        />

        {/*<Textarea
            maxRows={4}
  />*/}
      </Dialog>
    </React.Fragment>
  );
}