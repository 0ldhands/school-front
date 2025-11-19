import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config'; // Ensure you have the correct path to your config

import AddVanStudent from './AddVanStudent';
import { Link } from 'react-router-dom';

const VanStudent = () => {
  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]); // Store the original students data
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [addData, setAddData] = useState();
  const [clsData, setClsData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const tableRef = useRef(null);

  useEffect(() => {
    fetchClasses(); // Fetch class data on component mount
    fetchVanStudents(); // Initial fetch of all van students
  }, []);

  useEffect(() => {
    // Filter students whenever selectedClass changes
    if (selectedClass) {
      const filtered = originalStudents.filter((student) => student.cls_id == selectedClass);
      setStudents(filtered);
    } else {
      setStudents(originalStudents); // Reset to original list when no class is selected
    }
  }, [selectedClass, originalStudents]);

  const fetchVanStudents = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get(`${config.apiURL}/vanstudents`);
      setStudents(response.data);
      setOriginalStudents(response.data); // Store the original data
    } catch (err) {
      console.log('Error fetching van students:', err);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getClass`);
      setClsData(response.data);
    } catch (err) {
      console.log('Error fetching Class data', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId); // Update selected class ID
  };

  const handleAddStudent = () => {
    setAddData(null); // Clear previous data
    setOpenAddStudent(true);
  };

  const handleEditStudent = (student) => {
    setAddData(student);
    setOpenAddStudent(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.put(`${config.apiURL}/vanstudents/${studentId}`);
      fetchVanStudents(); // Refresh the student list
    } catch (err) {
      console.log('Error deleting student:', err);
    }
  };

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write(
      '<style>table { width: 100%; border-collapse: collapse; } table, th, td { border: 1px solid black; } th, td { padding: 8px; text-align: left; } .no-print { display: none; } @media print { .no-print { display: none; } }</style>'
    );
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const getClassName = (classId) => {
    const classData = clsData.find((cls) => cls.cls_id == classId);
    return classData ? classData.cls_name : 'N/A';
  };

  const filteredStudents = students.filter((student) => student.stu_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleClose = () => {
    setOpenAddStudent(false);
    fetchVanStudents(); 
  };

  return (
    <div>
      <Button variant="contained" color="primary" style={{ marginBottom: 16, marginLeft: 16 }} onClick={handleAddStudent}>
        Add Student
      </Button>
      <FormControl variant="outlined" style={{ minWidth: 120, marginLeft: 16, marginRight: 16 }}>
        <InputLabel>Class</InputLabel>
        <Select value={selectedClass} onChange={handleClassChange} label="Class">
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {clsData.map((cls) => (
            <MenuItem key={cls.cls_id} value={cls.cls_id}>
              {cls.cls_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField variant="outlined" label="Search by Name" onChange={handleSearchChange} style={{ marginBottom: 16 }} />
      <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginBottom: 16, marginLeft: 16 }}>
        <Print />
        Print
      </Button>
      {loading ? ( // Show loading indicator while data is being fetched
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} ref={tableRef}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: 'black' }}>
                <TableCell style={{ color: 'white' }}>ID</TableCell>
                <TableCell style={{ color: 'white' }}>Name</TableCell>
                <TableCell style={{ color: 'white' }}>Gender</TableCell>
                <TableCell style={{ color: 'white' }}>Class</TableCell>
                <TableCell style={{ color: 'white' }}>Van Fees</TableCell>
                <TableCell style={{ color: 'white' }}>Pending Fees</TableCell>
                <TableCell style={{ color: 'white' }} className="no-print">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.stu_id}>
                  <TableCell>{student.stu_id}</TableCell>
                  <TableCell>{student.stu_name}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{getClassName(student.cls_id)}</TableCell>
                  <TableCell>{student.van}</TableCell>
                  <TableCell style={{ color: 'red', fontWeight: 'bolder' }}>{student.vanRemaningFees}</TableCell>
                  <TableCell className="no-print">
                    {student.vanRemaningFees === 0 ? (
                      <span style={{ fontSize: 18, fontWeight: 'bolder', marginLeft: '30px' }}>Paid</span>
                    ) : (
                      <>
                        <Link to={`/vanpayfees/${student.stu_id}`}>
                          <Button startIcon={<Edit />} variant="contained" color="info">
                            Pay fees
                          </Button>
                        </Link>
                        <IconButton color="error" onClick={() => handleDeleteStudent(student.stu_id)}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openAddStudent} onClose={handleClose}>
        <DialogContent>
          <AddVanStudent data={addData} onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VanStudent;
