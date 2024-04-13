import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import RestrictionsDialog from './RestrictionsDialog';
import {t} from "i18next";



export default function AddRestrictionButton(){
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button 
        sx={{bgcolor: 'secondary.main'}} 
        onClick={() => {
            setOpen(true);
            setScroll('paper');
        }}>
            <AddIcon sx={{color: "secondary.contrastText"}}></AddIcon>
      </Button>
    <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="scroll-dialog-title">{t('add_restriction')}</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
                <RestrictionsDialog closeParentDialog={handleClose}></RestrictionsDialog>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t('cancel')}</Button>
        </DialogActions>
    </Dialog>
    </React.Fragment>
  );
}