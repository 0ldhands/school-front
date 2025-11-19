import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, Typography, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import moment from 'moment';
import config from '../../config';

const EmpAttendanceChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [year, setYear] = useState(moment().format('YYYY'));

  const staff_id = sessionStorage.getItem('staff_id');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${config.apiURL}/dashboard/empAttendChart`, {
          params: { staff_id, year },
        });

        // Ensure that the response data is an array
        if (Array.isArray(response.data)) {
          setAttendanceData(response.data);
        } else {
          setAttendanceData([]);
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setAttendanceData([]);
      }
    };

    fetchAttendanceData();
  }, [year, staff_id]);

  useEffect(() => {
    axios.get(`${config.apiURL}/staffs/getattenancedetails/${staff_id}`)
      .then((res) => {
        if (res.data && res.data.name) {
          setEmployeeName(res.data.name);
        } else {
          setEmployeeName('');
          // console.error('Unexpected response format for employee details:', res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [staff_id]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const pieChartData = {
    series: attendanceData.map((data) => data.count),
    options: {
      chart: {
        type: 'pie',
        height: 400,
      },
      labels: attendanceData.map((data) => `${months[data.month - 1]}: ${data.count}`),
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8', '#F77E53', '#DADADA'],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <>
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <Box textAlign="center">
              <Typography variant="h1" gutterBottom>
                {employeeName}
              </Typography>
              <Typography variant="h2">Employee Attendance</Typography>
            </Box>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <TextField 
              label="Enter Year" 
              value={year} 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setYear(e.target.value)} 
              fullWidth
            />
          </Grid>
        </Grid>
        <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie" height={400} />
      </MainCard>
    </>
  );
};

export default EmpAttendanceChart;
