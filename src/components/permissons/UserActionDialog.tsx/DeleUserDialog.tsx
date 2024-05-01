import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IUser } from "../../../helpers/constants";

type IProps = {
    onAccept: () => void;
    onCancel: () => void;
    user?: IUser;
};

const DeleteUserDialog = (props: IProps) => {
    return (
        <Dialog
            open={true}
            onClose={props.onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirm delete user"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure want to delete <b>{props.user?.email}</b>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}>Cancel</Button>
                <Button onClick={props.onAccept} autoFocus style={{ color: 'white', backgroundColor: "#e91e63" }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
 
export default DeleteUserDialog;