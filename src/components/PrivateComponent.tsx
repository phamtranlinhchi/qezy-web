import { ReactNode, memo, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsal,
} from '@azure/msal-react';
import {
    InteractionRequiredAuthError,
    InteractionStatus,
} from '@azure/msal-browser';
import axios from 'axios';

import Layout from '../layouts';
import { IUser, apiOrigin } from "../helpers/constants";
import NotPermisson from "./permissons/NotPermisson";
import { getUserByEmail } from "../helpers/fetch";
interface PrivateComponentProps {
    children: ReactNode;
    protect?: true;
}


const PrivateComponent: React.FC<PrivateComponentProps> = memo(
    ({ children, protect }) => {
        const { instance, inProgress, accounts } = useMsal();
        const [isTokenValid, setIsTokenValid] = useState(false);
        const [role, setRole] = useState("");
        useEffect(() => {
            if (inProgress === InteractionStatus.None) {
                const accessTokenRequest = {
                    scopes: ['user.read'],
                    account: accounts[0],
                    expires_in: 30 * 24 * 60 * 60,
                };

                instance
                    .acquireTokenSilent(accessTokenRequest)
                    .then(async (accessTokenResponse) => {
                        let accessToken = accessTokenResponse.accessToken;
                        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                        setIsTokenValid(true);

                    })
                    .catch((error) => {
                        if (error instanceof InteractionRequiredAuthError) {
                            instance
                                .acquireTokenPopup(accessTokenRequest)
                                .then(function (accessTokenResponse) {
                                    let accessToken = accessTokenResponse.accessToken;
                                    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                                    setIsTokenValid(true);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                        console.log(error);
                    });
            }

            if (accounts.length > 0) {
                const fetchData = async () => {
                    const authResult = await instance.acquireTokenSilent({
                        account: accounts[0],
                        scopes: ["user.read"],
                    });

                    const resAvatar = await axios.get(
                        `https://graph.microsoft.com/v1.0/me/photo/$value`,
                        {
                            headers: {
                                Authorization: `Bearer ${authResult.accessToken}`,
                            },
                            responseType: "blob",
                        }
                    );
                    const reader = new FileReader();
                    reader.readAsDataURL(resAvatar.data);

                    reader.onload = async () => {
                        const userName = accounts[0].username;
                        const name = accounts[0].name;
                        const idToken = accounts[0].idToken;

                        const data = {
                            email: userName,
                            name: name,
                            idToken: idToken,
                            avatar: reader.result
                        };
                        const responseLogin = await axios.post(`${apiOrigin}/user/login`, data);
                        if (responseLogin.data) {
                           const user: IUser = await getUserByEmail(userName);
                           setRole(user.role);
                        }
                    };
                }
                fetchData();
            }


        }, [instance, accounts, inProgress]);
        return (
            <>
                {isTokenValid && role === "ZMI.Guest" && (
                    <NotPermisson />
                )}
                {isTokenValid && role === "ZMI.SaleAgents" && protect && (
                    <Navigate to="/" />
                )}
                {isTokenValid && role === "ZMI.SaleAgents" && !protect && (
                    <AuthenticatedTemplate>
                        <Layout>{children}</Layout>
                    </AuthenticatedTemplate>
                )}
                {isTokenValid && role === "ZMI.GlobalAdmin" && (
                    <AuthenticatedTemplate>
                        <Layout>{children}</Layout>
                    </AuthenticatedTemplate>
                )}
                <UnauthenticatedTemplate>
                    <Navigate to="/welcome" />
                </UnauthenticatedTemplate>
            </>
        );
    }
);

export default PrivateComponent;
