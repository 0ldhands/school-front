import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Snackbar } from '@mui/material';
import axios from 'axios';
import config from '../../config'

const AcademicYearPage = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [newAcademicYear, setNewAcademicYear] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Regex to validate the format (e.g., 2023-2024)
  const academicYearRegex = /^\d{4}-\d{4}$/;

  const handleChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleNewAcademicYearChange = (e) => {
    setNewAcademicYear(e.target.value);
  };

  const handleSubmit = async () => {
    // Validation: Ensure both academic years are not empty and are in the correct format
    if (!academicYear || !newAcademicYear) {
      setSnackMessage('Please fill in both academic years.');
      setOpenSnackbar(true);
      return;
    }

    if (!academicYearRegex.test(academicYear) || !academicYearRegex.test(newAcademicYear)) {
      setSnackMessage('Please enter valid academic years in the format YYYY-YYYY.');
      setOpenSnackbar(true);
      return;
    }

    if (academicYear === newAcademicYear) {
      setSnackMessage('Old and new academic years cannot be the same.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${config.apiURL}/academicyear/updateAcademicYear`, {
        oldAcademicYear: academicYear,
        newAcademicYear,
      });
      setSnackMessage(response.data.message);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating academic year:', error);
      setSnackMessage('An error occurred while updating the academic year.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Select Academic Year
      </Typography>

      <TextField
        label="Old Academic Year"
        variant="outlined"
        fullWidth
        value={academicYear}
        onChange={handleChange}
        margin="normal"
        helperText="Enter in the format YYYY-YYYY"
        error={academicYear && !academicYearRegex.test(academicYear)}
      />

      <TextField
        label="New Academic Year"
        variant="outlined"
        fullWidth
        value={newAcademicYear}
        onChange={handleNewAcademicYearChange}
        margin="normal"
        helperText="Enter in the format YYYY-YYYY"
        error={newAcademicYear && !academicYearRegex.test(newAcademicYear)}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Submit
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackMessage}
      />
    </Container>
  );
};

export default AcademicYearPage;
