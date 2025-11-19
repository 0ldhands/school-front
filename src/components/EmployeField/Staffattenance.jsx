import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonBase ,Grid,Box,Typography} from '@mui/material';
import config from '../../config';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import TeacherProfile from './TeacherProfile';
  
function StaffAttendance() {
  const staff_id = sessionStorage.getItem('staff_id');
  const [studentsCount, setStudentsCount] = useState(0);
  const [staffsCount, setStaffsCount] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [chartData, setChartData] = useState([]);
 

  useEffect(() => {
    // Fetching data for Staff Dashboard
    axios.get(`${config.apiURL}/staffs/getStaffdash/${staff_id}`)
      .then((res) => {
        setStaffsCount(res.data);
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });

    
  }, []);

  const handleAttendance = async (statusn) => {
    try {
      const currentDate = new Date();
      const formattedTime = formatTime(currentDate);

      const formData = {
        staff_id: staff_id,
        statusn: statusn,
        entrytime: formattedTime,
        created_at: currentDate.toISOString().split('T')[0] // Get date in YYYY-MM-DD format
      };

      await axios.post(`${config.apiURL}/staffs/staffattenance`, formData);
      alert(`${statusn.charAt(0).toUpperCase() + statusn.slice(1)} recorded successfully at ${formattedTime}`);
    } catch (error) {
      console.error(`Error recording ${statusn}:`, error);
      alert(`Failed to record ${statusn}`);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };
  const handleAttendance1 = (entry) => {
    // Handle attendance recording logic based on type ('entry' or 'exit')
    console.log(`Recording ${entry}`);
  };
  const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #13c3c2 30%, #1677ff 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 90,
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
      background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    },
  }));
  return (
    <div>
      <h1>Staff Profile</h1>
      
      <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start" marginTop='-100px'>
        <Grid item xs={12} md={8} lg={9}>
          <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {staffsCount.length > 0 ? (
              <TeacherProfile data={staffsCount[0]} sx={{ width: '100%', height: '100%' }} />
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Link to={`/stafffeesdetail/${staff_id}`} style={{ textDecoration: 'none' }}>
              <GradientButton>Details</GradientButton>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default StaffAttendance;