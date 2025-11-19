import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config'; // Ensure you have the correct path to your config file
import AddSchemeStudent from './AddSchemeStudent';
import { Link } from 'react-router-dom';

const SchemeStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clsData, setClsData] = useState([]);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [addData, setAddData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = [...students];
    if (selectedClass) {
      filtered = filtered.filter((student) => student.cls_id == selectedClass);
    }
    if (searchTerm) {
      filtered = filtered.filter((student) => student.stu_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredStudents(filtered);
  }, [selectedClass, searchTerm, students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.apiURL}/schemestudents`);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err) {
      console.log('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getClass`);
      setClsData(response.data);
    } catch (err) {
      console.log('Error fetching classes:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleAddStudent = () => {
    setAddData(null);
    setOpenAddStudent(true);
  };

  const handleEditStudent = (student) => {
    setAddData(student);
    setOpenAddStudent(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.put(`${config.apiURL}/Schemestudents/${studentId}`);
      fetchStudents();
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

  const handleAddStudentClose = () => {
    setOpenAddStudent(false);
    fetchStudents();
  };

  return (
    <div>
      <Button variant="contained" color="primary" style={{ marginBottom: 16, marginLeft: 16 }} onClick={handleAddStudent}>
        Add Student
      </Button>
      <FormControl variant="outlined" style={{ minWidth: 120, marginLeft: 20, marginRight: 16 }}>
        <InputLabel>Class</InputLabel>
        <Select value={selectedClass} onChange={handleClassChange} label="Class">
          <MenuItem value="">
            <em>All Classes</em>
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
      {loading ? (
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
                <TableCell style={{ color: 'white' }}>Scheme Amount</TableCell>
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
                  <TableCell>{student.scheme}</TableCell>
                  <TableCell style={{ color: 'red', fontWeight: 'bolder' }}>{student.schemeRemaningFees}</TableCell>
                  {/* <TableCell className="no-print"> 
                                    <Link to={`/schemepayfees/${student.stu_id}`}>  <Button style={{ marginTop: "20px", }} startIcon={<Edit />} variant='contained' color='info'>Pay fees</Button></Link>
                                        <IconButton color="error" onClick={() => handleDeleteStudent(student.stu_id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell> */}

                  <TableCell className="no-print">
                    {student.schemeRemaningFees === 0 ? (
                      <span style={{ fontSize: 18, fontWeight: 'bolder', marginLeft: '30px' }}>Paid</span>
                    ) : (
                      <Link to={`/schemepayfees/${student.stu_id}`}>
                        <Button style={{ marginTop: '20px' }} startIcon={<Edit />} variant="contained" color="info">
                          Pay fees
                        </Button>
                        <IconButton color="error" onClick={() => handleDeleteStudent(student.stu_id)}>
                          <Delete />
                        </IconButton>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openAddStudent} onClose={handleAddStudentClose}>
        <DialogContent>
          <AddSchemeStudent data={addData} onClose={handleAddStudentClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddStudentClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SchemeStudent;
