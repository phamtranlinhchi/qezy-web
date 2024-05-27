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



const WelcomeUser = () => {
  const [examId, setExamId] = useState("")

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <TextField
        label='Exam ID Here'
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
        size="small"
        sx={{
          marginRight: "16px",
          width: "300px"
        }}
      />
      <a href={`http://localhost:8082/${examId}`}><Button variant="contained" color="success">Go to exam</Button></a>
    </Box>
  );
};
export default WelcomeUser;
