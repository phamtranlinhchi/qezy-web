import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import QuizIcon from '@mui/icons-material/Quiz';
import { Link } from 'react-router-dom';
import MicrosoftAuth from '../components/MicrosoftAuth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import UserInformation from '../components/Logout/UserInformation';

const NavBar = () => {
  const currPage = window.location.pathname.split('/')[1]
    ? window.location.pathname.split('/')[1]
    : 'exams';
  const [value, setValue] = React.useState(currPage);

  return (
    <Box
      sx={{ backgroundColor: '#FFFFFF', width: '100%', maxHeight: '60px' }}
      position={'sticky'}
      display={'flex'}
      zIndex={2}
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
            label="Exams"
            value="exams"
            icon={<ListAltIcon />}
            component={Link}
            to="/exams"
          />
          <BottomNavigationAction
            label="Questions"
            value="questions"
            icon={<QuizIcon />}
            component={Link}
            to="/questions"
          />
        </BottomNavigation>
      </Box>
      <Box width="25%" display={'flex'} justifyContent={'flex-end'}>
        <MicrosoftAuth type="signout" />
      </Box>
    </Box>
  );
};

export default NavBar;
