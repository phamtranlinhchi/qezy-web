import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { RedirectRequest } from "@azure/msal-browser";
import { loginRequest } from "../helpers/azureConfig";
import { Avatar, Box, Button, ClickAwayListener, Paper, Popper } from "@mui/material";
import UserInformation from "./Logout/UserInformation";
import Logout from "./Logout/Logout";

const MicrosoftAuth = (props: { type: string }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const { type } = props;
    const { instance } = useMsal();
    const { avatarUrl } = UserInformation();

    const handleLogin = (loginType: "redirect") => {
        if (loginType === "redirect") {
            instance.loginRedirect(loginRequest as RedirectRequest).catch(() => { });
        }
    };

    const handleLogout = () => {
        instance.logout();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return type === "signin" ? (
        <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={() => { handleLogin("redirect"); }}
        >
            Sign in with Microsoft
        </Button>
    )
        : (
            <Button onClick={handleClick}>
                <Avatar src={avatarUrl} />
                <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
                    <ClickAwayListener onClickAway={() => { setAnchorEl(null) }}>
                        <Box component={Paper}>
                            <Logout onClick={handleLogout} />
                        </Box>
                    </ClickAwayListener>
                </Popper>
            </Button>
        );
};

export default MicrosoftAuth;
