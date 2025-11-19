
import React, { useEffect, useState, useMemo } from 'react';
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
import StudentAdmissionApplication from './StudentAdmisson';
import StudentBookingUpdate from './BookingUpdate';
import { filter } from 'lodash';
import * as XLSX from 'xlsx';


const formatDate = (dateString) => {
  if (!dateString) {
    return '';  // Return an empty string if the date is null or undefined
  }

  const date = new Date(dateString);

  // Check if the date is invalid (Invalid Date object)
  if (isNaN(date.getTime())) {
    return '';  // Return an empty string for invalid dates
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


function AllBookingStudents() {
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
  const [admission, setAdmission] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${config.apiURL}/students/getBookingStudents`)
      .then((res) => {
        setRoleData(res.data);
        console.log("Response data:", res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate, openAddBooking, openAddEnquiry, dlt]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        setClsData(res.data);
      })
      .catch((err) => {
        console.log("Error fetching Class data", err);
      });
  }, []);
  const getClassName = (classId) => {
    const classData = clsData.find(cls => cls.cls_id == classId);
    return classData ? classData.cls_name : 'N/A';
  };
  // filter code
  useEffect(() => {
    Axios.get(`${config.apiURL}/students/getBookingStudents`)
      .then((res) => {
        setRoleData(res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate, openAddBooking, openAddEnquiry, dlt]);
  // Reset to the first page when the filter changes
  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when the filter changes
  }, [admission]);


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
    const selectData = roleData.find((stu) => stu.id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  const handleAdmisson = (student) => {
    setAddData(student);
    setOpenAddBooking(true);
  };

  const handleAddBooking = () => {
    setOpenAddEnquiry(true);
  };

  const handleDlt = (id) => {
    Axios.delete(`${config.apiURL}/students/deleteBookingStudent/${id}`)
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
  const handleChangebooking = (event) => {
    setAdmission(event.target.value);
  };

  //Export to Excel
  const exportToExcel = () => {
    // Map roleData to match table structure
    const filteredData = roleData
      .filter(search) // Apply search filter
      .filter(filterByAdmissionStatus) // Apply admission status filter
      .map((row, index) => ({
        "S.No": index + 1,
        "Student Name": row.student_name,
        "Booking Fees": row.bookingfees,
        "Date of Birth": formatDate(row.dob),
        Class: getClassName(row.class),
        "Date of Join": formatDate(row.date_of_join),
        "Aadhar No": row.aadhar_no,
        "Father Name": row.father_name,
        "Mother Name": row.mother_name,
        "Father Mobile": row.father_mobile,
        "Mother Mobile": row.mother_mobile,
        Gender: row.gender,
        "Date of Enquiry": formatDate(row.enquiry_date),
        Community: row.community,
        Address: row.address,
        Admission: row.confirm === "yes" ? "Confirmed" : "Not Confirmed",
      }));

    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Save workbook as an Excel file
    XLSX.writeFile(workbook, "StudentDetails.xlsx");
  };




  // const search = (item) => {
  //   const searchValue = searchedVal.toLowerCase();
  //   return Object.values(item).some(
  //     (value) => value && value.toString().toLowerCase().includes(searchValue)
  //   );
  // };

  //searc bar
  // const search = (item) => {
  //   const searchValue = searchedVal.toLowerCase();

  //   // Handle 'class' field separately by using the getClassName function
  //   const className = getClassName(item.class).toLowerCase(); // Get class name and convert to lowercase

  //   return Object.keys(item).some((key) => {
  //     // If the key is 'class', use the transformed className
  //     if (key === 'class') {
  //       return className.includes(searchValue); // Compare against the search value
  //     }

  //     // For other fields, continue with the original logic
  //     const value = item[key];
  //     return value && value.toString().toLowerCase().includes(searchValue);
  //   });
  // };

  const search = (item) => {
    const searchValue = searchedVal.toLowerCase();

    // Handle 'class' field separately by using the getClassName function
    const className = getClassName(item.class).toLowerCase(); // Get class name and convert to lowercase

    return Object.keys(item).some((key) => {
      // If the key is 'class', use the transformed className
      if (key === 'class') {
        return className.includes(searchValue); // Compare against the search value
      }

      // For other fields, continue with the original logic
      const value = item[key];
      return value && value.toString().toLowerCase().includes(searchValue);
    });
  };





  const filterByAdmissionStatus = (item) => {
    const confirmValue = item.confirm ? item.confirm.trim().toLowerCase() : "";

    if (admission === "Admission") {
      return confirmValue === "yes"; // Only show students with admission confirmed
    } else if (admission === "Non Admission") {
      return confirmValue !== "yes"; // Only show students without confirmed admission
    } else if (admission === "Student") {
      return true; // Show all students regardless of status
    } else {
      return true; // Default case: no filter applied
    }
  };



  // Filter the data based on search value
  // const filteredData = useMemo(() => {
  //   return roleData
  //     .filter(search)
  //     .filter(filterByAdmissionStatus);
  // }, [roleData, searchedVal, admission]);

  // Filter the data based on search value and admission status
  const filteredData = useMemo(() => {
    return roleData
      .filter(search) // Apply the search filter
      .filter(filterByAdmissionStatus); // Apply the admission status filter
  }, [roleData, searchedVal, admission]);


  // Paginate the filtered data
  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = dataPerPage > 0 ? currentPage * dataPerPage : filteredData.length;
  const currentData = filteredData.slice(firstIndexOfData, lastIndexOfData);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddBooking}>New Booking</Button>
          {/* <Link to='/uploadExcel' className='ms-2'>
            <Button variant="contained" color="success">Upload Excel</Button>
          </Link> */}

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
          <FormControl >
            <Select
              name="filter" // Sets the name of the Select
              value={admission} // Binds the value to the state
              onChange={handleChangebooking} // Updates the state on change
              displayEmpty // Ensures the placeholder is shown when no value is selected
            >
              <MenuItem value="" disabled>
                Filter
              </MenuItem>
              <MenuItem value="Admission">Admission</MenuItem>
              <MenuItem value="Non Admission">Non Admission</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>

          </FormControl>
          <Button
            variant="contained"
            color="success"
            onClick={exportToExcel}
            style={{ marginLeft: "10px" }}
          >
            Export to Excel
          </Button>
        </Grid>
      </Grid><br /><br />

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
        maxHeight: '55vh', // Limit vertical height for vertical scrolling
        overflowY: 'auto', // Enable vertical scrolling
        overflowX: 'auto', // Enable to horizontal scrolling
      }} >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', height: '75px' }} >Student name</StyledTableCell>
              <StyledTableCell align="left">Booking Fess</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }} >Date Of Birth</StyledTableCell>
              <StyledTableCell align="left">Class</StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: 'nowrap' }} >Date Of Join</StyledTableCell>
              <StyledTableCell align="left">Aadhar no</StyledTableCell>
              <StyledTableCell align="left">Father name</StyledTableCell>
              <StyledTableCell align="left">Mother name</StyledTableCell>
              <StyledTableCell align="left">Father Mobile</StyledTableCell>
              <StyledTableCell align="left">Mother Mobile</StyledTableCell>
              <StyledTableCell align="left">Gender</StyledTableCell>
              <StyledTableCell align="left">Date of Enquiry</StyledTableCell>
              <StyledTableCell align="left">Community</StyledTableCell>
              <StyledTableCell align="left">Address</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <StyledTableRow key={row.stu_id}>
                <StyledTableCell component="th" scope="row">
                  {firstIndexOfData + index + 1}
                </StyledTableCell>
                <StyledTableCell align="left" style={{
                  maxWidth: '300px',  // Set max width to 15 characters worth
                  wordWrap: 'break-word',  // Break the word if it's too long
                  whiteSpace: 'normal', //allow wrapping to the next line

                }} >{row.student_name}</StyledTableCell>
                <StyledTableCell align="left">{row.bookingfees}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.dob)}</StyledTableCell>
                <StyledTableCell align="left">{getClassName(row.class)}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.date_of_join)}</StyledTableCell>
                <StyledTableCell align="left">{row.aadhar_no}</StyledTableCell>
                <StyledTableCell align="left">{row.father_name}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_name}</StyledTableCell>
                <StyledTableCell align="left">{row.father_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.gender}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.enquiry_date)}</StyledTableCell>
                <StyledTableCell align="left">{row.community}</StyledTableCell>
                <StyledTableCell align="left">{row.address}</StyledTableCell>
                {row.confirm === 'yes' ? (
                  <StyledTableCell align="left">
                    <Button variant="contained" color="success" fullWidth disabled>
                      Admission Confirmed
                    </Button>
                    <Button variant="contained" color='error' fullWidth startIcon={<DeleteIcon />} onClick={() => handleDlt(row.id)}>
                      Delete
                    </Button>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="left">
                    <Button variant="contained" color="primary" fullWidth startIcon={<AddIcon />} onClick={() => handleAdmisson(row)}>
                      Admission
                    </Button>
                    <Button variant="contained" color='error' fullWidth startIcon={<DeleteIcon />} onClick={() => handleDlt(row.id)}>
                      Delete
                    </Button>
                    <Button variant="contained" color="warning" fullWidth startIcon={<EditIcon />} onClick={() => handleUpdate(row.id)}>
                      Edit
                    </Button>
                  </StyledTableCell>
                )
                }

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={openAddBooking} onClose={() => setOpenAddBooking(false)}>
        <DialogContent>
          <StudentAdmissionApplication data={addData} onClose={() => setOpenAddBooking(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBooking(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddEnquiry} onClose={() => setOpenAddEnquiry(false)}>
        <DialogContent>
          <StudentBookingApplication data={addData} onClose={() => setOpenAddEnquiry(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEnquiry(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <StudentBookingUpdate data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllBookingStudents;
