import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import UserInformation from "./UserInformation";
import { useMsal } from "@azure/msal-react";

type IProps = {
    onClick: () => void;
}

const Logout = (props: IProps) => {
    const { accounts } = useMsal();
    let userName = "";
    let name = "";
    if(accounts.length > 0) {
        userName = accounts[0].username;
        name = accounts[0].name ? accounts[0].name : "";
    }
    const { avatarUrl } = UserInformation();

    return (
        <Box border={"1px solid rgba(0, 0, 0, 0.1)"} padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
                </Grid>
                <Grid item xs={8} alignContent={"center"}>
                    <Typography noWrap sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        <b>{name}</b>
                    </Typography>
                    <Typography noWrap sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontSize: 12 }}>
                        {userName}
                    </Typography>
                </Grid>
                <Box>

                </Box>
            </Grid>
            <Box mt={2}>
                <Button
                    fullWidth
                    type="button"
                    color="primary"
                    variant="contained"
                    onClick={props.onClick}
                >
                    Sign out
                </Button>
            </Box>
        </Box>
    );
};

export default Logout;
