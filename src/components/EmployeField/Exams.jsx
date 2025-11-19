
import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField,Snackbar } from '@mui/material';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import config from '../../config';


const staff_id = sessionStorage.getItem('staff_id');

function Exams() {
  const [examNames, setExamNames] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [examData, setExamData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    axios.get(`${config.apiURL}/students/getexamsalloc`)
      .then((res) => {
        setExamNames(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleExamSelect = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedExamObject = examNames.find(exam => exam.exam_name === selectedExam);
    if (selectedExamObject) {
      axios.get(`${config.apiURL}/students/examdata/${selectedExamObject.exam_id}`, {
        params: { staff_id }
      })
      .then((res) => {
        setExamData(res.data);
        setAlertSeverity('success');
        setAlertMessage('Exam data fetched successfully!');
        setAlertOpen(true);
      })
      .catch((err) => {
        setAlertSeverity('error');
        setAlertMessage('Error fetching exam data!');
        setAlertOpen(true);
        console.error('Error fetching exam data:', err);
      });
    } else {
      setAlertSeverity('error');
      setAlertMessage('Selected exam not found!');
      setAlertOpen(true);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...examData[index] });
  };

  const handleEditChange = (e, field) => {
    const updatedData = {
      ...editData,
      [field]: e.target.value,
    };

    // Calculate total marks
    const subjects = ['tamil', 'english', 'maths', 'science', 'social'];
    let total = 0;
    subjects.forEach(subject => {
      const mark = parseInt(updatedData[subject], 10);
      if (!isNaN(mark)) {
        total += mark;
      }
    });

    updatedData.total = total;
    setEditData(updatedData);
  };


  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${config.apiURL}/students/updateExamData`, editData);
      if (response.data.success) {
        setExamData(examData.map((row, idx) => (idx === editIndex ? editData : row)));
        setEditIndex(null);
        setAlertSeverity('success');
        setAlertMessage('Exam data Edit successfully!');
        setAlertOpen(true);
        setEditData({});
      } else {
        console.error('Failed to update data:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  return (
    <div>
      <h1>Exams</h1>
      <Link to="/markallocstud">
        <Button variant="contained" color="primary">Add Marks</Button>
      </Link>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <Select
          value={selectedExam}
          onChange={handleExamSelect}
          displayEmpty
          inputProps={{ 'aria-label': 'Select exam' }}
          style={{ marginRight: '10px' }}
        >
          <MenuItem value="" disabled>Select Exam</MenuItem>
          {examNames.map((examName) => (
            <MenuItem key={examName.exam_id} value={examName.exam_name}>
              {examName.exam_name}
            </MenuItem>
          ))}
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Get Exam Data
        </Button>
      </form>

      {examData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(examData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examData.map((dataRow, index) => (
                <TableRow key={index}>
                  {Object.keys(dataRow).map((key) => (
                    <TableCell key={key}>
                      {editIndex === index ? (
                        <TextField
                          value={editData[key]}
                          onChange={(e) => handleEditChange(e, key)}
                        />
                      ) : (
                        dataRow[key]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editIndex === index ? (
                      <Button onClick={handleSaveClick} color="primary">Save</Button>
                    ) : (
                      <Button onClick={() => handleEditClick(index)} color="primary">Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
          No Data Available
        </Typography>
      )}
    </div>
  );
}

export default Exams;
