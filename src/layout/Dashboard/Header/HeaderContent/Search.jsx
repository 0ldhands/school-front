import React from 'react';
import { Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const styles = {
  logoutButton: {
    backgroundColor: 'black',
    color: 'white',
    height: '40px',
    position: 'absolute',
    right: '50px',
    top: '10px',
    display: 'flex',
    alignItems: 'center'
  }
};

export default function Search() {
  const handleLogout = () => {
    // Clear the token or any other authentication data
    sessionStorage.removeItem('authToken'); // Adjust according to your token key
    sessionStorage.clear();
    window.location.replace('/');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '60px',
        textAlign: 'center',
        color: 'white',
        background: 'linear-gradient(to right, #6A5ACD, red)', // New gradient color
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the text
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Increased 3D effect
        fontWeight: 'bold',
        fontSize: '1.5rem', // Adjusted font size
        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.8)', // Enhanced text shadow
        transition: 'background 0.3s, transform 0.3s', // Smooth transition for hover effect
        position: 'relative', // Relative positioning for the container
        '&:hover': {
          background: 'linear-gradient(to right, red, #6A5ACD)', // Reverse gradient on hover
          transform: 'scale(1.01)', // Slightly enlarge on hover
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)' // Increase shadow on hover
        }
      }}
    >
      <h1 style={{ fontWeight: 'bolder', fontFamily: 'Times', margin: 0, zIndex: 1 }}>Dream Public School</h1>
      <Button onClick={handleLogout} variant="contained" sx={styles.logoutButton} startIcon={<LogoutIcon />}>
        Logout
      </Button>
    </Box>
  );
}
