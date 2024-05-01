import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import { Autocomplete, Grid } from "@mui/material";
import { useState } from "react";

type IProps = {
    onAccept: () => void;
    onCancel: () => void;
};

const options = ["Sale Agent", "Administrator"];

const AddUserDialog = (props: IProps) => {
    const [value, setValue] = useState<string | null>(options[0]);
    const [inputValue, setInputValue] = useState("");
    return (
        <Dialog
            open={true}
            onClose={props.onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Add user"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={2}>
                        <PersonIcon />
                    </Grid>
                    <Grid item xs={7}>
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            value={value}
                            onChange={(e, newValue) => setValue(newValue)}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            id="controllable-states-demo"
                            options={options}
                            renderInput={(params) => <TextField {...params} label="Controllable" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button onClick={props.onAccept} autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserDialog;