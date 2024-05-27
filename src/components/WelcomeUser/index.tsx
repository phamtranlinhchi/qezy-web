import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
// import MicrosoftAuth from '../MicrosoftAuth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from "react";


const WelcomeUser = () => {
  const [examId, setExamId] = useState("")

  return (
    <Box sx={{
      width: "100vw",
      height: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Box>
        <Box sx={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
          <img
            src="../public/assets/images/qezy_logo.png"
            alt=""
            style={{ height: '130px' }}
          ></img>
        </Box>
        <Box>
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
      </Box>
    </Box>
  );
};
export default WelcomeUser;
