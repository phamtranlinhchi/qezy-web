import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import UserInformation from "./UserInformation";

type IProps = {
    onClick: () => void;
}

const Logout = (props: IProps) => {
    const { avatarUrl, name, userName, role } = UserInformation();

    return (
        <Box sx={{ width: "280px" }} border={"1px solid rgba(0, 0, 0, 0.1)"} padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
                </Grid>
                <Grid item xs={8} alignContent={"center"}>
                    <Typography noWrap sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        <b>{name}</b>
                    </Typography>
                    <Typography noWrap sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontSize: 12 }}>
                        {userName} {role === "admin" ? <b>{`${role.toUpperCase()}`}</b> : ""}
                    </Typography>
                </Grid>
                <Box>

                </Box>
            </Grid>
            <Box mt={2}>
                <Button
                    fullWidth
                    type="button"
                    color="error"
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
