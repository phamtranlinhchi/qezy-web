import { Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: "20px 0px" }}>
      <div style={{ textAlign: 'center' }}>
        <img
          width="80px"
          src="../../public/assets/images/qezy_logo.png"
          alt="error"
        />
        <Typography>Copyright by Chee 2024</Typography>
        <Typography><span
          style={{ display: "block" }}>
          Qezy-V0.1.1
        </span></Typography>
      </div>
    </footer>
  );
};

export default Footer;
