import { Box, Button, TextField } from '@mui/material';
// import MicrosoftAuth from '../MicrosoftAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Cookies from "js-cookie"

import { login, register } from "../../helpers/fetch";



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfpassword, setCFPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate()
  const accessToken = Cookies.get('access_token');

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== cfpassword)
      return setErrMsg("Password not match!")
    if (password.length < 8 || password.length > 30)
      return setErrMsg("Password should have at least 8 characters and max 30")
    const response = await register(username, password, fullName)
    if (response?.status === 200) {
      setErrMsg("")
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

  const handleChangeCFPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCFPassword(event.target.value);
    setErrMsg("")
  }

  const handleChangeFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
    setErrMsg("")
  }

  return (
    <>
      {
        accessToken ? <Navigate to="/" /> :
          <Box
            sx={{
              height: '85vh',
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
                onSubmit={handleRegister}>
                <TextField
                  color="success"
                  fullWidth
                  label='Full Name (*)'
                  id='fullName'
                  name='fullName'
                  InputLabelProps={{ required: false }}
                  required
                  value={fullName}
                  onChange={handleChangeFullName}
                />
                <TextField
                  sx={{ mt: 2 }}
                  color="success"
                  fullWidth
                  label='Username (*)'
                  id='username'
                  name='username'
                  InputLabelProps={{ required: false }}
                  required
                  value={username}
                  onChange={handleChangeUsername}
                />
                <TextField
                  sx={{ mt: 2 }}
                  color="success"
                  fullWidth
                  label='Password (*)'
                  id='password'
                  name='password'
                  type="password"
                  InputLabelProps={{ required: false }}
                  required
                  value={password}
                  onChange={handleChangePassword}
                />
                <TextField
                  sx={{ mt: 2 }}
                  color="success"
                  fullWidth
                  label='Retype password (*)'
                  id='cfpassword'
                  name='cfpassword'
                  type="password"
                  InputLabelProps={{ required: false }}
                  required
                  value={cfpassword}
                  onChange={handleChangeCFPassword}
                />
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
                  Already have an account? <Link to="/welcome">Login now</Link>
                </Box>
                {/* <MicrosoftAuth type="signin" /> */}
                <Button type="submit" sx={{
                  mt: 3,
                }}
                  color="success"
                  variant="contained">REGISTER</Button>
              </Box>
            </Box>
          </Box >
      }
    </>
  );
};
export default Register;
