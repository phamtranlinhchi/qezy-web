import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { Box } from '@mui/material';

import MicrosoftAuth from '../MicrosoftAuth';
import { Navigate } from 'react-router-dom';

const Welcome = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <Navigate to="/" />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Box
          sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          {/*  */}
          <Box sx={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '30px',
                color: 'rgb(14,91,165)',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Qezy
            </h1>
            <MicrosoftAuth type="signin" />
          </Box>
        </Box>
      </UnauthenticatedTemplate>
    </>
  );
};
export default Welcome;
