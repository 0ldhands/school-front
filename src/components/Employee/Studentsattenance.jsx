import axios from 'axios';
import config from '../../config';
import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function StudentsAttendance() {
  const [classTeachers, setClassTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiURL}/staffAllocation/getclassteach`)
      .then((response) => {
        setClassTeachers(response.data);
        setLoading(false);  // Data fetching is complete
      })
      .catch((error) => {
        console.error("Error fetching class teachers data:", error);
        setError("Failed to fetch class teachers data");
        setLoading(false);  // Data fetching is complete, but an error occurred
      });
  }, []);

 
  return (
    <div>
      {classTeachers.map((teacher) => (
  <Link to={''}>  <Button key={teacher.staff_id}>{teacher.staff_name}</Button></Link>
      ))}
    </div>
  );
}

export default StudentsAttendance;
