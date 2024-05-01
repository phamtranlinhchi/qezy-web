import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { IUser } from "../../helpers/constants";
import { getUserByEmail } from "../../helpers/fetch";

const UserInformation = () => {
    const { accounts, instance } = useMsal();
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {

        const getUserInfo = async () => {
            const userName = accounts[0].username;
            const user: IUser = await getUserByEmail(userName);
            setRole(user.role);
            setAvatarUrl(user.avatar);
            setName(accounts[0].name ? accounts[0].name : user.name);
            setUserName(userName);
        }
        
        if (accounts.length > 0) {
            getUserInfo();
        }
    }, [accounts, instance]);

    return { userName, avatarUrl, name, role };
};

export default UserInformation;
