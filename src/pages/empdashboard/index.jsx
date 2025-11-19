import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { IoLogIn, IoLogOut } from 'react-icons/io5';
import EmpAttendanceChart from './StaffAttendancechart';

export default function DashboardDefault() {
    const [staffName, setStaffName] = useState('');
    const [staffsCount, setStaffsCount] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const navigate = useNavigate();
    const staff_id = sessionStorage.getItem('staff_id');

    useEffect(() => {
        const fetchStaffDetails = async () => {
            try {
                const res = await axios.get(`${config.apiURL}/staffs/getStaffdash/${staff_id}`);
                if (res.data && res.data.length > 0) {
                    const staffData = res.data[0];
                    setStaffName(staffData.staff_name);
                } else {
                    console.error('Staff details are not in the expected format:', res.data);
                }
            } catch (error) {
                console.error('Error fetching staff details:', error);
            }
        };

        const fetchStaffDashboardData = async () => {
            try {
                const res = await axios.get(`${config.apiURL}/staffs/getStaffdash/${staff_id}`);
                if (res.data) {
                    setStaffsCount(res.data);
                } else {
                    console.error('Staff dashboard data is not in the expected format:', res.data);
                }
            } catch (error) {
                console.error('Error fetching staff dashboard data:', error);
            }
        };

        fetchStaffDetails();
        fetchStaffDashboardData();
    }, [staff_id]);

    const handleAttendance = async (entryType) => {
        try {
            const currentDateTime = new Date();
            const formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace('T', ' '); // Get datetime in YYYY-MM-DD HH:mm:ss format

            const endpoint = entryType === 'entry' ? 'empEntry' : 'empExit';

            const res = await axios.post(`${config.apiURL}/staffs/${endpoint}/${staff_id}`, {
                datetime: formattedDateTime
            });

            setAlertSeverity('success');
            setAlertMessage(res.data.message);
        } catch (error) {
            console.error(`Error recording ${entryType}:`, error);

            if (error.response && error.response.status === 400) {
                setAlertSeverity('warning');
                setAlertMessage(error.response.data.message);
            } else {
                setAlertSeverity('error');
                setAlertMessage(`Failed to record ${entryType}`);
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken'); // Adjust according to your token key
        sessionStorage.clear();
        navigate('/', { replace: true });
        window.location.reload();
    };

    return (
        <Grid container spacing={2} sx={{ backgroundColor: 'lightblue', padding: 1, borderRadius: 2, justifyContent: 'center', position: 'relative' }}>
            {alertMessage && (
                <Alert severity={alertSeverity} onClose={() => setAlertMessage(null)} sx={{ mb: 2 }}>
                    {alertMessage}
                </Alert>
            )}
            <Typography sx={styles.header}>
                Welcome, {staffName}
            </Typography>
            <Grid container item xs={12} spacing={2} justifyContent="space-around" alignItems="center">
                <Grid item xs={12} md={6} lg={6}>
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {staffsCount.length > 0 ? (
                            <EmpAttendanceChart sx={{ width: '100%', height: '100%' }} />
                        ) : (
                            <Typography>Loading...</Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={6} md={1} lg={2.5} sx={styles.entryExitContainer}>
                    <Box sx={styles.box} onClick={() => handleAttendance('entry')}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Entry
                        </Typography>
                        <IoLogIn style={styles.icon} />
                    </Box>
                    <Box sx={styles.box} onClick={() => handleAttendance('exit')} mt={2}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Exit
                        </Typography>
                        <IoLogOut style={styles.icon} />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}



const styles = {
  box: {
    fontWeight: 'bold',
    height: '130px',
    width: '100%',
    borderRadius: '15px',
    padding: '10px',
    display: 'flex',
    cursor: 'pointer',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.3s, background-color 0.3s',
    backgroundColor: '#9EA0D8',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#FFC0CB',
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  icon: {
    fontSize: '40px',
    color: '#3f51b5',
    height: '70px',
    width: '70px',

  },
  logoutButton: {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    top: '20px',
    right: '10px',
  },
  header: {
    margin: '20px 0',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  entryExitContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'fadeIn 1s ease-in-out',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};
