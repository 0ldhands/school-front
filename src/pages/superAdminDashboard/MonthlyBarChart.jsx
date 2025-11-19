import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ReactApexChart from 'react-apexcharts';
import config from '../../config';

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = () => {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [series, setSeries] = useState([
    {
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]);

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 365,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    },
    colors: [info],
    xaxis: {
      labels: {
        style: {
          colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
        }
      }
    }
  });

  useEffect(() => {
    axios.get(`${config.apiURL}/dashboard/feesLogs/day`)
      .then(response => {
        // Process the API data to update the series state
        const newData = response.data.map(item => parseFloat(item.total_paid_amount_current_week));
        setSeries([{ data: newData }]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Only execute once on component mount

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
};

export default MonthlyBarChart;
