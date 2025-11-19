import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import UpdateStudent from './UpdateStudent';
import config from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import StudentEnquiryApplication from './StudentEnquiryApplication';
import StudentBookingApplication from './Booking';
import * as XLSX from 'xlsx';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; // Return a placeholder if the date is not available
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date'; // Handle invalid date formats
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Format for input type 'date'
};
// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date)) return 'Invalid Date';
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   } catch {
//     return 'Invalid Date';
//   }
// };



function AllStudents() {
  const [roleData, setRoleData] = useState([]);
  const [clsData, setClsData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAddBooking, setOpenAddBooking] = useState(false);
  const [openAddEnquiry, setOpenAddEnquiry] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [addData, setAddData] = useState();
  const [selectedStudent, setSelectedStudent] = useState(null); // New state for selected student
  const [openFeesDialog, setOpenFeesDialog] = useState(false); // State to control the dialog visibility


  const navigate = useNavigate();

  // useEffect(() => {
  //   Axios.get(`${config.apiURL}/students/getAllStudents`)
  //     .then((res) => {
  //       setRoleData(res.data);
  //       console.log("Response data:", res.data);
  //     })
  //     .catch((err) => {
  //       console.log('Error:', err);
  //     });
  // }, [openUpdate, openAddBooking, openAddEnquiry, dlt]);
  useEffect(() => {
    Axios.get(`${config.apiURL}/students/getAllStudents`)
      .then((res) => {
        console.log('Response data:', res.data); // Check the data here
        setRoleData(res.data);
      })
      .catch((err) => console.log('Error:', err));
  }, [openUpdate, openAddBooking, openAddEnquiry, dlt]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        console.log('Classes Response:', res.data); // Log response here
        setClsData(res.data);
      })
      .catch((err) => {
        console.log('Error fetching classes:', err);
      });
  }, []);

  const getClassName = (classId) => {
    if (!clsData || clsData.length === 0) {
      console.log('Class data not loaded yet.');
      return 'N/A';
    }
    const classData = clsData.find((cls) => cls.cls_id === classId);
    return classData ? classData.cls_name : 'N/A';
  };




  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleUpdate = (id) => {
    const selectData = roleData.find((stu) => stu.stu_id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  const handleAddBooking = (student) => {
    setAddData(student);
    setOpenAddBooking(true);
  };

  const handleAddEnquiry = () => {
    setOpenAddEnquiry(true);
  };

  const handleDlt = (id) => {
    Axios.delete(`${config.apiURL}/students/deleteStudent/${id}`)
      .then(() => {
        console.log("Deleted successfully");
        setDlt(prev => !prev);  // Toggle dlt to trigger useEffect
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  };

  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    setDataPerPage(newDataPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // pending fees
  const handleShowPendingFees = (student) => {
    setSelectedStudent(student); // Set the selected student
    setOpenFeesDialog(true); // Open the dialog
  };



  //Export To Excel
  const exportToExcel = () => {
    const filteredData = roleData
      .filter(search)
      .map((row, index) => ({
        "S.No": index + 1,
        "Student Name": row.stu_name,
        "Date of Birth": formatDate(row.dob),
        Class: getClassName(row.cls_id),
        "Date of Join": formatDate(row.date_of_join),
        "Aadhar No": row.stu_aadhar,
        "Father Name": row.father_name,
        "Mother Name": row.mother_name,
        "Father Mobile": row.father_mobile,
        "Mother Mobile": row.mother_mobile,
        Gender: row.gender,
        Community: row.community,
        Address: row.address,
        Booking_fees: row.bookingfees,
        tution_fees: row.tution_fees,

      }));

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Save workbook as an Excel file
    XLSX.writeFile(workbook, "StudentDetails.xlsx");
  }

  // const search = (item) => {
  //   const searchValue = searchedVal.toLowerCase();
  //   return Object.values(item).some(
  //     (value) => value && value.toString().toLowerCase().includes(searchValue)
  //   );
  // };
  const search = (item) => {
    const searchValue = searchedVal.toLowerCase(); // Lowercase search term for comparison

    // Handle the 'class' field separately using getClassName
    const className = getClassName(item.cls_id).toLowerCase(); // Fetch and lowercase the class name

    return Object.keys(item).some((key) => {
      // For the 'cls_id' key (class), use the className value for search
      if (key === 'cls_id') {
        return className.includes(searchValue);
      }

      // For other fields, compare their values directly
      const value = item[key];
      return value && value.toString().toLowerCase().includes(searchValue); // Case-insensitive comparison
    });
  };


  // Filter the data based on search value
  const filteredData = roleData.filter(search);

  // Paginate the filtered data
  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = dataPerPage > 0 ? currentPage * dataPerPage : filteredData.length;
  const currentData = filteredData.slice(firstIndexOfData, lastIndexOfData);

  // const getClassName = (classId) => {
  //   const classData = clsData.find(cls => cls.cls_id == classId);
  //   return classData ? classData.cls_name : 'N/A';
  // };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddEnquiry}>New Admission</Button>

        </Grid>
        <Grid item xs={3}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={3}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={20}>20 Per Page</MenuItem>
              <MenuItem value={0}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <Link to='/uploadExcel' className='ms-2' style={{ marginRight: '15px' }} >
            <Button variant="contained" color="success">Upload Excel</Button>
          </Link>
          <Button
            variant='contained'
            color='primary'
            onClick={exportToExcel}
          > Export To Excel </Button>
        </Grid>
      </Grid><br />

      <Grid container spacing={1} display="flex" justifyContent="center" className="mt-3">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredData.length / dataPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1.25rem', // Increase the font size
                width: '48px', // Adjust the width of the circle
                height: '48px', // Adjust the height of the circle
                transition: 'all 0.3s ease', // Add smooth hover effect
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'green', // Add hover background color
                color: '#fff', // Change text color on hover
                transform: 'scale(1.1)', // Slightly enlarge on hover
              },
              '& .Mui-selected': {
                backgroundColor: 'green !important', // Keep selected circle styled
                color: '#fff !important',
              },
            }}
          />
        </Stack>
      </Grid>
      <br />


      <TableContainer component={Paper} className='mt-3' style={{
        maxHeight: '59vh',
        overflowX: 'auto',
        overflowY: 'auto'

      }} >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }} >Student name</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }} >Date Of Birth</StyledTableCell>
              <StyledTableCell align="left">Class</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }} >Date Of Join</StyledTableCell>
              <StyledTableCell align="left">Aadhar no</StyledTableCell>
              <StyledTableCell align="left">Father name</StyledTableCell>
              <StyledTableCell align="left">Mother name</StyledTableCell>
              <StyledTableCell align="left">Father Mobile</StyledTableCell>
              <StyledTableCell align="left">Mother Mobile</StyledTableCell>
              <StyledTableCell align="left">Gender</StyledTableCell>
              <StyledTableCell align="left">Community</StyledTableCell>
              <StyledTableCell align="left">Address</StyledTableCell>
              <StyledTableCell align="left">Booking Fess</StyledTableCell>
              <StyledTableCell align="left">Tution Fess</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <StyledTableRow key={row.stu_id} onClick={() => handleShowPendingFees(row)} >
                <StyledTableCell component="th" scope="row">
                  {firstIndexOfData + index + 1}
                </StyledTableCell>
                <StyledTableCell align="left">{row.stu_name}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.dob)}</StyledTableCell>
                <StyledTableCell align="left">{getClassName(row.cls_id)}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.date_of_join)}</StyledTableCell>
                <StyledTableCell align="left">
                  {row.stu_aadhar ? row.stu_aadhar : 'N/A'}
                </StyledTableCell>
                <StyledTableCell align="left">{row.father_name}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_name}</StyledTableCell>
                <StyledTableCell align="left">{row.father_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.gender}</StyledTableCell>
                <StyledTableCell align="left">{row.community}</StyledTableCell>
                <StyledTableCell align="left">{row.address}</StyledTableCell>
                <StyledTableCell align="left">{row.bookingfees}</StyledTableCell>
                <StyledTableCell align="left">{row.tution_fees}</StyledTableCell>
                <StyledTableCell align="left">
                  {/* <Link to={`/payfees/${row.stu_id}`}>
                  <Button variant="contained" color='success' fullWidth startIcon={<AddIcon/>} >
                    Pay Fees
                  </Button>
                  </Link> */}

                  <Button variant="contained" color='error' fullWidth startIcon={<DeleteIcon />} onClick={() => handleDlt(row.stu_id)}>
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" fullWidth startIcon={<EditIcon />} onClick={() => handleUpdate(row.stu_id)}>
                    Edit
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={openAddBooking} onClose={() => setOpenAddBooking(false)}>
        <DialogContent>
          <StudentBookingApplication data={addData} onClose={() => setOpenAddBooking(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBooking(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddEnquiry} onClose={() => setOpenAddEnquiry(false)}>
        <DialogContent>
          <StudentEnquiryApplication data={addData} onClose={() => setOpenAddEnquiry(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEnquiry(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <UpdateStudent data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={openFeesDialog} onClose={() => setOpenFeesDialog(false)}>
  <DialogContent>
    {selectedStudent ? (
      <div>
        <h3>Student: {selectedStudent.stu_name}</h3>
        <p><strong>Tution Fees:</strong> {selectedStudent.tution_fees}</p>
        <p><strong>Pending Fees:</strong> 
          <span style={{color: selectedStudent.pending_fees > 0 ? 'red' : 'green', fontWeight: 'bold'}}>
            {selectedStudent.pending_fees ? `₹${selectedStudent.pending_fees}` : 'No Pending Fees'}
          </span>
        </p>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </DialogContent>
  <DialogActions>
    {/* Only render the Pay Fees button if there are pending fees */}
    {selectedStudent && selectedStudent.pending_fees > 0 && (
      <Link to={`/payfees/${selectedStudent.stu_id}`}>
        <Button variant="contained" color="info">
          Pay fees
        </Button>
      </Link>
    )}
    <Button onClick={() => setOpenFeesDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>



    </div>
  );
}

export default AllStudents;
