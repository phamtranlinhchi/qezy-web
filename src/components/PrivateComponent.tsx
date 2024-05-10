import { ReactNode, memo, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

import Layout from '../layouts';

interface PrivateComponentProps {
    children: ReactNode;
    protect?: true;
}


const PrivateComponent: React.FC<PrivateComponentProps> = memo(
    ({ children }) => {
        const accessToken = Cookies.get('access_token');

        useEffect(() => {
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }, [accessToken]);
        return (
            <>
                {accessToken ? (
                    <Layout>{children}</Layout>
                ) : <Navigate to="/welcome" />}
            </>
        );
    }
);

export default PrivateComponent;
