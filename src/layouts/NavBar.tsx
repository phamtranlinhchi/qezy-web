import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { useMsal } from '@azure/msal-react';
import ApprovalIcon from '@mui/icons-material/Approval';
import AirplayIcon from '@mui/icons-material/Airplay';
import { Link } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MicrosoftAuth from '../components/MicrosoftAuth';
import { GridSearchIcon } from '@mui/x-data-grid';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ListIcon from '@mui/icons-material/List';
import RecentActorsRoundedIcon from '@mui/icons-material/RecentActorsRounded';
import UserInformation from '../components/Logout/UserInformation';

const NavBar = () => {
  const currPage = window.location.pathname.split('/')[1]
    ? window.location.pathname.split('/')[1]
    : 'home';
  const [value, setValue] = React.useState(currPage);
  const { role } = UserInformation();

  return (
    <Box
      sx={{ backgroundColor: '#FFFFFF', width: '100%', maxHeight: '60px' }}
      position={'sticky'}
      display={'flex'}
      zIndex={1}
      borderBottom="1px solid #E9EAE0"
      top={0}
    >
      <Box
        width="10%"
        display={'flex'}
        alignItems={'center'}
        justifyContent="flex-start"
        ml={4}
      >
        <img
          src="../public/assets/images/draphonyLogo.png"
          alt=""
          style={{ height: '80%' }}
        ></img>
      </Box>
      <Box width="65%" display={'flex'} alignItems={'center'}>
        <BottomNavigation
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}
          showLabels
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Opps"
            value="home"
            icon={<ListAltIcon />}
            component={Link}
            to="/"
          />
          {role === 'ZMI.GlobalAdmin' && (
            <BottomNavigation
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction
                label="Permissions"
                value="permissions"
                icon={<RecentActorsRoundedIcon />}
                component={Link}
                to="/permissions"
              />
            </BottomNavigation>
          )}
        </BottomNavigation>
      </Box>
      <Box width="25%" display={'flex'} justifyContent={'flex-end'}>
        <MicrosoftAuth type="signout" />
      </Box>
    </Box>
  );
};

export default NavBar;
