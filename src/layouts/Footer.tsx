import { Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: "20px 0px" }}>
      <div style={{ textAlign: 'center' }}>
        <img
          width="80px"
          src="../../public/assets/images/draphonyLogo.png"
          alt="error"
        />
        <Typography>Copyright by Draphony 2024</Typography>
        <Typography><span
          style={{ marginTop: "10px", display: "block" }}>
          ZMI-V0.3.X
        </span></Typography>
      </div>
    </footer>
  );
};

export default Footer;
