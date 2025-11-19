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
import UpdateStudent from '../StudentsDomain/UpdateStudent';
import config from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function AllStudents() {
  const [roleData, setRoleData] = useState([]);
  const [clsData, setClsData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${config.apiURL}/academicyear/getAllAcademicyearStudents`)
      .then((res) => {
        setRoleData(res.data);
      })
      .catch((err) => console.log('Error:', err));
  }, [openUpdate, dlt]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        setClsData(res.data);
      })
      .catch((err) => {
        console.log('Error fetching classes:', err);
      });
  }, []);

  const getClassName = (classId) => {
    if (!clsData || clsData.length === 0) {
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

  const handleDlt = (id) => {
    Axios.delete(`${config.apiURL}/students/deleteStudent/${id}`)
      .then(() => {
        setDlt((prev) => !prev);
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

  const handleExcel = ()=>{
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
            "Gender": row.gender,
            "Community": row.community,
            "Address": row.address,
            "Booking_fees": row.bookingfees,
            "tution_fees": row.tution_fees,
            "Academic Year":row.academic_year
    
          }));
    
        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
    
        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    
        // Save workbook as an Excel file
        XLSX.writeFile(workbook, "StudentDetails.xlsx");
  }


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

  const filteredData = roleData.filter(search);

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = dataPerPage > 0 ? currentPage * dataPerPage : filteredData.length;
  const currentData = filteredData.slice(firstIndexOfData, lastIndexOfData);

  return (
    <div>
      <Grid container spacing={3}>
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

          
        </Grid>
        <Grid item xs={3}>
        <Button variant='contained' color='primary' onClick={handleExcel}>Export To Excel</Button>
        </Grid>
      </Grid><br /><br/>

      <Grid container spacing={1} display="flex" justifyContent="center" className="mt-3">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredData.length / dataPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1.25rem',
                width: '48px',
                height: '48px',
                transition: 'all 0.3s ease',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'green',
                color: '#fff',
                transform: 'scale(1.1)',
              },
              '& .Mui-selected': {
                backgroundColor: 'green !important',
                color: '#fff !important',
              },
            }}
          />
        </Stack>
      </Grid>
      <br />

      <TableContainer component={Paper} className='mt-3' style={{ maxHeight: '55vh', overflowX: 'auto', overflowY: 'auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="left">Student Name</StyledTableCell>
              <StyledTableCell align="left" style={{whiteSpace:'nowrap'}} >Date Of Birth</StyledTableCell>
              <StyledTableCell align="left"  >Class</StyledTableCell>
              <StyledTableCell align="left"style={{whiteSpace:'nowrap'}} >Date Of Join</StyledTableCell>
              <StyledTableCell align="left" style={{whiteSpace:'nowrap'}}  >Aadhar No</StyledTableCell>
              <StyledTableCell align="left" style={{whiteSpace:'nowrap'}}  >Father Name</StyledTableCell>
              <StyledTableCell align="left" style={{whiteSpace:'nowrap'}}  >Mother Name</StyledTableCell>
              <StyledTableCell align="left">Father Mobile</StyledTableCell>
              <StyledTableCell align="left">Mother Mobile</StyledTableCell>
              <StyledTableCell align="left">Gender</StyledTableCell>
              <StyledTableCell align="left">Community</StyledTableCell>
              <StyledTableCell align="left">Address</StyledTableCell>
              <StyledTableCell align="left" style={{whiteSpace:'nowrap'}}   >Academic Year</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <StyledTableRow key={row.stu_id}>
                <StyledTableCell component="th" scope="row">{firstIndexOfData + index + 1}</StyledTableCell>
                <StyledTableCell align="left">{row.stu_name}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.dob)}</StyledTableCell>
                <StyledTableCell align="left">{getClassName(row.cls_id)}</StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.date_of_join)}</StyledTableCell>
                <StyledTableCell align="left">{row.stu_aadhar}</StyledTableCell>
                <StyledTableCell align="left">{row.father_name}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_name}</StyledTableCell>
                <StyledTableCell align="left">{row.father_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.mother_mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.gender}</StyledTableCell>
                <StyledTableCell align="left">{row.community}</StyledTableCell>
                <StyledTableCell align="left">{row.address}</StyledTableCell>
                <StyledTableCell align="left">{row.academic_year}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="lg" fullWidth>
        <DialogContent>
          <UpdateStudent data={updateData} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllStudents;
