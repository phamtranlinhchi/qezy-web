import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import QuizIcon from '@mui/icons-material/Quiz';
import { Link } from 'react-router-dom';
import MicrosoftAuth from '../components/MicrosoftAuth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Cookies from "js-cookie";
import axios from 'axios';
import UserInformation from "../components/Logout/UserInformation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../helpers/fetch";

const NavBar = () => {
  const accessToken = Cookies.get('access_token');
  const currPage = window.location.pathname.split('/')[1]
    ? window.location.pathname.split('/')[1]
    : 'exams';
  const [value, setValue] = useState(currPage);
  const [role, setRole] = useState("");

  useEffect(() => {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const fetchData = async () => {
      const currentUser = await getCurrentUser()

      setRole(currentUser.role as string);
    }
    fetchData();
  }, [])
  return (
    <Box
      sx={{ backgroundColor: '#006425', width: '100%', maxHeight: '60px' }}
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
        fontFamily={"Verdana, sans-serif"}
        color={"#4cf6b9"}
        fontWeight={"bold"}
      >
        <img
          src="../public/assets/images/qezy_logo.png"
          alt=""
          style={{ height: '80%' }}
        ></img>
        QEZY
      </Box>
      <Box width="65%" display={'flex'} alignItems={'center'}>
        <BottomNavigation
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            backgroundColor: '#006425',
            "& .MuiBottomNavigationAction-root, .Mui-selected, svg": {
              color: "#ebebeb"
            },
            "& .Mui-selected, .Mui-selected > svg": {
              color: "#FFA17A !important",
              fontWeight: "bold"
            }
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
          {role === "admin" && (

            <BottomNavigationAction
              label="Questions"
              value="questions"
              icon={<QuizIcon />}
              component={Link}
              to="/questions"
            />
          )}
          {role === "admin" && (
            <BottomNavigationAction
              label="Users"
              value="users"
              icon={<AccountBoxIcon />}
              component={Link}
              to="/users"
            />
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
