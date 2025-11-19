import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { Flip } from 'react-awesome-reveal';

function StaffAllocationIndex() {
  const buttonStyle = {
    width: '600px',
    height: '400px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(145deg, #1677ff, #74e0da)',
    boxShadow: '5px 5px 10px #363636, -5px -5px 10px #ffffff',
    borderRadius: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '10px 10px 20px #363636, -10px -10px 20px #ffffff',
    },
    '&:active': {
      transform: 'translateY(-2px)',
      boxShadow: '7px 7px 14px #363636, -7px -7px 14px #ffffff',
    },
  };

  const button = { to: '/classteach', icon: <SchoolIcon sx={{ fontSize: 80 }} />, label: 'Class Teacher', flipDirection: 'horizontal' };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', paddingTop: '20px' }}>
      <Flip direction={button.flipDirection} triggerOnce>
        <Link to={button.to} style={{ textDecoration: 'none' }}>
          <Button sx={buttonStyle}>
            <Stack alignItems="center">
              {button.icon}
              {button.label}
            </Stack>
          </Button>
        </Link>
      </Flip>
    </Box>
  );
}

export default StaffAllocationIndex;