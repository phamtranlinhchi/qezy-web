import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IUser } from "../../../helpers/constants";
import DraphonyList from "../DraphonyList";

type IProps = {
    onAccept: () => void;
    onCancel: () => void;
    user?: IUser;
};

const EditUserDialog = (props: IProps) => {

    return (
        <Dialog
            maxWidth={"lg"}
            open={true}
            onClose={props.onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Edit User"}
            </DialogTitle>
            <DialogContent>
                {props.user && <DraphonyList users={[props.user]} hideColumn={true}/>}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onAccept} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditUserDialog;
