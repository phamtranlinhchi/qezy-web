import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useLocation } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        borderTop: 'none',
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Home = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (location.pathname.includes('jobs')) {
      setValue(0);
    }
    if (location.pathname.includes('training')) {
      setValue(1);
    }
    if (location.pathname.includes('companies')) {
      setValue(2);
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          fontSize: '14px',
          width: ' 50vw',
          padding: '12px',
          right: '100%',
        }}
        transition={Bounce}
      />
      <Typography variant="h5" sx={{ marginBottom: '10px' }}>
        Opportunity
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Job"
              icon={<BusinessCenterIcon />}
              iconPosition="start"
              {...a11yProps(0)}
            />
            {/* <Tab
              label="Training"
              icon={<MenuBookIcon />}
              iconPosition="start"
              {...a11yProps(1)}
            />
            <Tab
              label="Company"
              icon={<ApartmentIcon />}
              iconPosition="start"
              {...a11yProps(2)}
            /> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box sx={{ marginTop: '12px', fontSize: '12px' }}>
            Ef: Total number of jobs that have been filtered by each keyword /
            (number of keywords x number of jobs)
          </Box>
        </CustomTabPanel>
        {/* <CustomTabPanel value={value} index={1}>Training</CustomTabPanel>
        <CustomTabPanel value={value} index={2}>Company</CustomTabPanel> */}
      </Box>
    </>
  );
};

export default Home;
