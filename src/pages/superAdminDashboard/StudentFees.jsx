import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-apexcharts';
import config from '../../config';

const FeeCollectionChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: 'collect-fee-chart',
        type: 'bar'
      },
      xaxis: {
        categories: []
      }
    }
  });

  useEffect(() => {
    axios.get(`${config.apiURL}/feelogs/collect-fee-data`)
      .then(response => {
        const data = response.data;
        const names = data.map(item => item.stu_name);
        const totalAmounts = data.map(item => parseFloat(item.payingfee));

        setChartData(prevState => ({
          ...prevState,
          series: [{
            name: 'Total Amount',
            data: totalAmounts
          }],
          options: {
            ...prevState.options,
            xaxis: {
              categories: names
            }
          }
        }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};



export default FeeCollectionChart;
