import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './Chart.css';
import config from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentStrengthPieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiURL}/students/studentscount`);
        const data = response.data;
        console.log(data);

        // Prepare data for the pie chart
        const chartData = {
          labels: data.map((item) => item.year),
          datasets: [
            {
              label: 'Student Strength',
              data: data.map((item) => item.student_count),
              backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        };

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} students`;
          }
        }
      }
    }
  };

  return <div style={{ margin: 'auto', width: '50%' }}>{chartData && <Pie data={chartData} options={options} />}</div>;
};

export default StudentStrengthPieChart;
