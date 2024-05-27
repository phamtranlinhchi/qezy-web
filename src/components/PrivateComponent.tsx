import { ReactNode, memo, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

import Layout from '../layouts';
import UserInformation from "./Logout/UserInformation";

interface PrivateComponentProps {
    children: ReactNode;
    protect?: true;
}


const PrivateComponent: React.FC<PrivateComponentProps> = memo(
    ({ children, protect }) => {
        const accessToken = Cookies.get('access_token');
        const { role } = UserInformation();

        useEffect(() => {
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }, [accessToken]);
        return (
            <>
                {
                    accessToken ? ((role === "user" ? <Navigate to="/welcome-user" /> : (<Layout>{children}</Layout>))) : <Navigate to="/welcome" />
                }
            </>
        );
    }
);

export default PrivateComponent;
