import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import config from '../../config'; // Ensure you have the correct path to your config file

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AddVanStudent = ({ data, onClose }) => { // Destructure onClose from props
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clsData, setClsData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [vanFees, setVanFees] = useState('');
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    fetchClasses(); // Fetch class data on component mount
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  const fetchStudentsByClass = async (cls_id) => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get(`${config.apiURL}/students/${cls_id}`);
      setStudents(response.data);
    } catch (err) {
      console.log("Error fetching students:", err);
    } finally {
      setLoading(false); // Set loading to false after fetching data
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
    const classId = e.target.value;
    setSelectedClass(classId); // Update selected class ID
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleVanFeesChange = (e) => {
    setVanFees(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${config.apiURL}/addVanStudent`, {
        studentIds: selectedStudents,
        vanFees: vanFees
      });

      if (response.status === 201) {
        alert('Students updated successfully');
        // Reset form
        setSelectedClass('');
        setStudents([]);
        setSelectedStudents([]);
        setVanFees('');
        onClose(); // Close the dialog
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
    student.stu_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <TextField
        variant="outlined"
        label="Search by Name"
        onChange={handleSearchChange}
        value={searchTerm}
        style={{ marginBottom: 16 }}
      />
      <TextField
        variant="outlined"
        label="Van Fees"
        onChange={handleVanFeesChange}
        value={vanFees}
        style={{ marginBottom: 16 }}
      />
      {loading ? ( // Show loading indicator while data is being fetched
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
                {/* Add more columns as needed */}
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
                  {/* Add more cells as needed */}
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

export default AddVanStudent;
