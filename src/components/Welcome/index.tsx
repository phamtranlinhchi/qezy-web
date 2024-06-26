import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
// import MicrosoftAuth from '../MicrosoftAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from "js-cookie"

import { login } from "../../helpers/fetch";



const Welcome = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate()
  const accessToken = Cookies.get('access_token');


  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await login(username, password)
    if (response?.status === 200) {
      setErrMsg("")
      const expireDate = new Date(response.data.accessToken.expires)
      Cookies.set('access_token', response.data.accessToken.token, { expires: expireDate });
      navigate('/')
    }
    else
      setErrMsg(response?.message)
  }

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setErrMsg("")
  }

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrMsg("")
  }

  return (
    <>
      {
        accessToken ? <Navigate to="/" /> :
          <Box
            sx={{
              height: '80vh',
              width: '100vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              fontFamily: "Verdana, sans-serif"
            }}
          >
            {/*  */}
            <Box sx={{ textAlign: 'center', width: "30%" }}>
              <img
                width="120px"
                src="../../public/assets/images/qezy_logo.png"
                alt="error"
              />
              <Box
                component={"form"}
                sx={{
                  mt: 2,
                }}
                onSubmit={handleLogin}>
                <TextField
                  color="success"
                  fullWidth
                  label='Username'
                  id='username'
                  name='username'
                  InputLabelProps={{ required: false }}
                  required
                  value={username}
                  onChange={handleChangeUsername}

                />
                <Box sx={{
                  mt: 2,
                  width: "100%",
                }}>
                  <FormControl sx={{ width: '100%' }} color="success" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      color="success"
                      endAdornment={
                        <InputAdornment position="end" color="success">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="success"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      required
                      label="Password"
                      value={password}
                      onChange={handleChangePassword}
                    />
                  </FormControl>
                </Box>
                {
                  errMsg && <Box sx={{
                    mt: 2,
                    width: "100%",
                    textAlign: "left",
                    color: "red",
                    marginLeft: "4px",
                    fontSize: "12px"
                  }}>
                    {errMsg}
                  </Box>
                }
                <Box sx={{
                  mt: 2,
                  width: "100%",
                  textAlign: "left",
                  marginLeft: "4px",
                  fontSize: "12px"
                }}>
                  Don't have an account? <Link to="/register">Register now</Link>
                </Box>
                {/* <MicrosoftAuth type="signin" /> */}
                <Button type="submit" sx={{
                  mt: 3,
                }}
                  color="success"
                  variant="contained">LOGIN</Button>
              </Box>
            </Box>
          </Box >
      }
    </>
  );
};
export default Welcome;
