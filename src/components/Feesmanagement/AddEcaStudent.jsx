import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import config from '../../config';

const AddEcaStudent = ({ data, onClose }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clsData, setClsData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [ecaFees, setEcaFees] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  const fetchStudentsByClass = async (cls_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiURL}/students/${cls_id}`);
      setStudents(response.data);
    } catch (err) {
      console.log("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getClass`);
      setClsData(response.data);
    } catch (err) {
      console.log("Error fetching Class data", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleGenderFilterChange = (e) => {
    setGenderFilter(e.target.value);
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleEcaFeesChange = (e) => {
    setEcaFees(e.target.value);
  };

  const handleActivityChange = (e) => {
    const { value } = e.target;
    setSelectedActivities(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${config.apiURL}/addEcaStudent`, {
        studentIds: selectedStudents,
        ecaFees,
        activities: selectedActivities.join(',')
      });

      if (response.status === 201) {
        alert('Students updated successfully');
        setSelectedClass('');
        setStudents([]);
        setSelectedStudents([]);
        setEcaFees('');
        setSelectedActivities([]);
        onClose();
      } else {
        alert('Error updating students');
      }
    } catch (err) {
      console.log("Error updating students:", err);
      alert('Error updating students');
    }
  };

  const getClassName = (cls_id) => {
    const cls = clsData.find((cls) => cls.cls_id === cls_id);
    return cls ? cls.cls_name : 'Unknown';
  };

  const filteredStudents = students.filter(student =>
    student.stu_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!genderFilter || student.gender === genderFilter)
  );

  return (
    <div>
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 16 }}>
        <InputLabel>Class</InputLabel>
        <Select
          value={selectedClass}
          onChange={handleClassChange}
          label="Class"
        >
          {clsData.map((cls) => (
            <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 16 }}>
        <InputLabel>Activities</InputLabel>
        <Select
          multiple
          value={selectedActivities}
          onChange={handleActivityChange}
          label="Activities"
        >
          <MenuItem value="Western">Western</MenuItem>
          <MenuItem value="Silampam">Silampam</MenuItem>
          <MenuItem value="Classical">Classical</MenuItem>
          <MenuItem value="Karate">Karate</MenuItem>
          <MenuItem value="Skating">Skating</MenuItem>
          <MenuItem value="Chess">Chess</MenuItem>
          {/* Add more activities as needed */}
        </Select>
      </FormControl>

      <TextField
        variant="outlined"
        label="Search by Name"
        onChange={handleSearchChange}
        value={searchTerm}
        style={{ marginBottom: 16 }}
      />

      <TextField
        variant="outlined"
        label="ECA Fees"
        onChange={handleEcaFeesChange}
        value={ecaFees}
        style={{ marginBottom: 16 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Class</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.stu_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.includes(student.stu_id)}
                      onChange={() => handleCheckboxChange(student.stu_id)}
                    />
                  </TableCell>
                  <TableCell>{student.stu_id}</TableCell>
                  <TableCell>{student.stu_name}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{getClassName(student.cls_id)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        Submit
      </Button>
    </div>
  );
};

export default AddEcaStudent;
