import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import config from '../../config';

function Allocation() {
  const [classes, setClasses] = useState([]); // Initialize with an empty array

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClasses(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("classes err :", err);
      });
  }, []); // Add dependency array to run the effect only once

  const cardStyle = {
    width: '100%',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(120deg, #f8f9fa, #d0e3f1)',
    borderRadius: '20px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    textDecoration: 'none',
    transition: 'transform 0.3s, box-shadow 0.3s',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    },
  };

  const rippleEffect = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.6)',
    transform: 'scale(0)',
    borderRadius: '50%',
    opacity: '0.5',
    animation: 'ripple-animation 1s ease-out infinite',
  };

  return (
    <Grid container spacing={3} style={{ padding: '20px' }}>
      {classes.map((cls, index) => (
        <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
          <Link to={`/studentalloc/${cls.cls_id}`} style={{ textDecoration: 'none' }}>
            <Box sx={cardStyle}>
              <Box sx={{ ...rippleEffect }} />
              <Typography variant="h6" fontWeight="bold" color="#333" zIndex={1}>
                {cls.cls_name}
              </Typography>
              <Typography variant="body2" color="#555">
                Explore Class Details
              </Typography>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default Allocation;
