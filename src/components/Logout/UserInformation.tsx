import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { getCurrentUser } from "../../helpers/fetch";

const UserInformation = () => {
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const accessToken = Cookies.get('access_token');

    useEffect(() => {

        const getUserInfo = async () => {
            const user: any = await getCurrentUser();
            setRole(user.role);
            setAvatarUrl(user.avatar);
            setName(user.fullName);
            setUserName(user.username);
        }

        if (accessToken) getUserInfo();
    }, [accessToken]);

    return { userName, avatarUrl, name, role };
};

export default UserInformation;
