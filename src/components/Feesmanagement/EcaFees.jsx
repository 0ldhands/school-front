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
import AddEcaStudent from './AddEcaStudent';
import { Link } from 'react-router-dom';

const EcaStudent = () => {
  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]); // Store the original students data
  const [searchTerm, setSearchTerm] = useState('');
  const [clsData, setClsData] = useState([]);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [addData, setAddData] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const tableRef = useRef(null);

  useEffect(() => {
    fetchClasses(); // Fetch class data on component mount
    fetchEcaStudents(); // Initial fetch of all ECA students
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

  const fetchEcaStudents = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get(`${config.apiURL}/ecastudents`);
      setStudents(response.data);
      setOriginalStudents(response.data); // Store the original data
    } catch (err) {
      console.log('Error fetching ECA students:', err);
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
    setAddData(null); // Clear any existing data
    setOpenAddStudent(true);
  };

  const handleEditStudent = (student) => {
    setAddData(student);
    setOpenAddStudent(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.put(`${config.apiURL}/ecastudents/${studentId}`);
      fetchEcaStudents(); // Refresh the student list
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

  const handleAddStudentClose = () => {
    setOpenAddStudent(false);
    fetchEcaStudents(); // Refresh the student list after adding/editing
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
      {loading ? ( // Show loading indicator while data is being fetched
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} ref={tableRef}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>ID</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>Name</TableCell>
                {/* <TableCell>Aadhar</TableCell> */}
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>Gender</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>Class</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>Activities</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>ECA Fees</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }}>Peding Fees</TableCell>
                <TableCell style={{ color: 'white', backgroundColor: 'black' }} className="no-print">
                  Actions
                </TableCell>
                {/* Added class for hiding on print */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.stu_id}>
                  <TableCell>{student.stu_id}</TableCell>
                  <TableCell>{student.stu_name}</TableCell>
                  {/* <TableCell>{student.stu_aadhar}</TableCell> */}
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{getClassName(student.cls_id)}</TableCell>
                  <TableCell>{student.activities}</TableCell>
                  <TableCell>{student.eca_fees}</TableCell>
                  <TableCell style={{ color: 'red', fontWeight: 'bolder' }}>{student.ecaRemaningFees}</TableCell>
                  <TableCell className="no-print" align="right">
                    {student.ecaRemaningFees === 0 ? (
                      <span style={{ fontSize: 18, fontWeight: 'bolder', marginLeft: '30px' }}>Paid</span>
                    ) : (
                      <Link to={`/ecapayfees/${student.stu_id}`}>
                        <Button style={{ marginTop: '20px' }} startIcon={<Edit />} variant="contained" color="info">
                          Pay fees
                        </Button>
                        <IconButton color="error" onClick={() => handleDeleteStudent(student.stu_id)}>
                          <Delete />
                        </IconButton>
                      </Link>
                    )}
                  </TableCell>
                  {/* <TableCell className="no-print"> 
                     <Link to={`/ecapayfees/${student.stu_id}`}>  <Button style={{ marginTop: "20px", marginLeft: "10px" }} startIcon={<Edit />} variant='contained' color='info'>Pay fees</Button></Link> 
                    <IconButton color="error" onClick={() => handleDeleteStudent(student.stu_id)}>
                      <Delete />
                    </IconButton>                   
                  </TableCell>                   */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openAddStudent} onClose={() => setOpenAddStudent(false)}>
        <DialogContent>
          <AddEcaStudent data={addData} onClose={handleAddStudentClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStudent(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EcaStudent;
