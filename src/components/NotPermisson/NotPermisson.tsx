import { useMsal } from '@azure/msal-react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';

const NotPermisson = () => {
  const { instance } = useMsal();

  const handleOnClick = () => {
    instance.logout();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: '30vh',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <img src="../public/assets/images/warning.png" alt="" width="100vw" />
      <Typography mt={2}>
        <b>You do not have permisson to access to Qezy</b>
      </Typography>
      <Typography>
        Either go back to the previous page or login as a different account
      </Typography>
      <Button
        variant="contained"
        style={{ margin: '20px 0' }}
        onClick={handleOnClick}
      >
        Log in as different account
      </Button>
      <Button>Go back</Button>
    </Box>
  );
};

export default NotPermisson;
