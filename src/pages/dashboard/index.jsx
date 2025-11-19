import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import UniqueVisitorCard from './UniqueVisitorCard';
import SmallCalendar from './SmallCalender';
import { Link, useNavigate } from 'react-router-dom';
import { PiStudent } from 'react-icons/pi';
import { IoLogOutOutline, IoPeopleSharp } from 'react-icons/io5';
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register all necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const styles = {
  box: {
    fontWeight: 'bold',
    height: '130px',
    width: '100%',
    borderRadius: '15px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.3s, background-color 0.3s',
    backgroundColor: '#9EA0D8', // Initial color
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#FFC0CB' // Color on hover
    }
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  icon: {
    height: '70px',
    width: '70px',
    color: 'blue'
  },
  logoutButton: {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    top: '60px',
    right: '10px',
    zIndex: 1000 // Ensure it stays on top
  }
};

export default function DashboardDefault() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [staffsCount, setStaffsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [lineChartData, setLineChartData] = useState({ labels: [], values: [] });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => {
        setStaffsCount(res.data.length);
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });

    axios
      .get(`${config.apiURL}/students/getStudentsCount`)
      .then((res) => {
        setStudentsCount(res.data.total_count);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiURL}/dashboard/totalPaidAmount/${selectedYear}`)
      .then((res) => {
        setTotalRevenue(res.data);
      })
      .catch((error) => {
        console.error('Error fetching revenue:', error);
      });
  }, [selectedYear]);

  // useEffect(() => {
  //   axios
  //     .get(`${config.apiURL}/dashboard/monthlyData`)
  //     .then((res) => {
  //       setLineChartData({
  //         labels: res.data.labels,
  //         values: res.data.values
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching line chart data:', error);
  //     });
  // }, []);

  const chartData = {
    labels: lineChartData.labels,
    datasets: [
      {
        label: 'New Admission',
        data: lineChartData.values.map((item) => item.newAdmissions),
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderColor: 'blue',
        borderWidth: 1
      },
      {
        label: 'Total Students',
        data: lineChartData.values.map((item) => item.totalStudents),
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'green',
        borderWidth: 1
      }
    ]
  };

  const handleLogout = () => {
    // Clear the token or any other authentication data
    sessionStorage.removeItem('authToken'); // Adjust according to your token key
    sessionStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        },
        stacked: true
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        },
        stacked: true
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
      <Grid container rowSpacing={6.5} columnSpacing={2.75} style={{ background: 'linear-gradient(to right,lightblue, pink)' }}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h6">Dashboard</Typography>
        </Grid>

        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Link to="/newAdmission" style={{ color: 'white', textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#5251AC',
                fontWeight: 'bold',
                height: '130px',
                width: '250px',
                borderRadius: '15px',
                padding: '10px'
              }}
            >
              <span style={{ color: 'white', display: 'block', marginBottom: '10px', marginTop: '10px' }}>
                <h5> New Enquiry Admission </h5>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PiStudent style={{ height: '40px', width: '50px', color: 'white' }} />
              </div>
            </div>
          </Link>
        </Grid>

        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Link to="/StudentsBooking" style={{ color: 'white', textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#6789F5',
                fontWeight: 'bold',
                height: '130px',
                width: '250px',
                borderRadius: '15px',
                padding: '10px'
              }}
            >
              <span style={{ color: 'white', display: 'block', marginBottom: '10px', marginTop: '10px' }}>
                <h5> Booking Students </h5>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PiStudent style={{ height: '40px', width: '50px', color: 'white' }} />
                <h2 style={{ marginLeft: '10px', marginRight: '10px', color: 'white', fontSize: '24px', textAlign: 'center' }}>
                  {/* {studentsCount} */}
                </h2>
              </div>
            </div>
          </Link>
        </Grid>

        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Link to="/allstudentlist" style={{ color: 'white', textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#9EA0D8',
                fontWeight: 'bold',
                height: '130px',
                width: '250px',
                borderRadius: '15px',
                padding: '10px'
              }}
            >
              <span style={{ color: 'white', display: 'block', marginBottom: '10px', marginTop: '10px' }} className="hover">
                <h5> New Admissions</h5>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoPeopleSharp style={{ height: '40px', width: '50px', color: 'white' }} />
                <h2 style={{ marginLeft: '10px', marginRight: '10px', color: 'white', fontSize: '24px', textAlign: 'center' }}>
                  {studentsCount}
                </h2>
              </div>
            </div>
          </Link>
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <UniqueVisitorCard />
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <SmallCalendar />
          <Bar data={chartData} options={chartOptions} style={{ height: '300px', width: '100%', marginTop: '75px' }} />
        </Grid>
      </Grid>
    </Box>
  );
}
