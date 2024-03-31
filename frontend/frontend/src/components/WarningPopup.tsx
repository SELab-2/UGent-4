import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {t} from "i18next";

interface WarningPopupProps {
    title: string,
    content: string,
    buttonName: string,
    open: boolean,
    handleClose: () => void,
    doAction: () => void,
}

export default function WarningPopup({title, content, buttonName, open, handleClose, doAction}: WarningPopupProps){
    const hanldeAction = () => {
        doAction();
        handleClose();
    }
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{textAlign: "center"}}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center"}}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>{t("cancel")}</Button>
                    <Button variant="contained" color="primary" onClick={hanldeAction} autoFocus>{buttonName}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}