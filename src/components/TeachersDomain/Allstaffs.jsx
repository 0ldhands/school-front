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
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Select, TextField ,MenuItem} from '@mui/material';
import { Link } from 'react-router-dom';
import UpdateStaff from './UpdateStaff'; // Assuming you have UpdateStaff component
import config from '../../config'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Add, Delete, Edit } from '@mui/icons-material';
function AllStaffs() {
  const [staffData, setStaffData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    Axios.get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => {
        setStaffData(res.data);
        console.log("Response data :", res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate, dlt]);

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
    const selectData = staffData.find((staff) => staff.staff_id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  const handleDelete = (id) => {
    Axios.delete(`${config.apiURL}/staffs/deleteStaff/${id}`)
      .then((res) => {
        console.log("Deleted successfully :");
        setDlt(true);
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

  const search = (item) => {
    const searchValue = searchedVal.toLowerCase();
    return Object.values(item).some(
      (value) => value && value.toString().toLowerCase().includes(searchValue)
    );
  };

  const firstIndexOfData = (currentPage - 1) * dataPerPage;
  const lastIndexOfData = currentPage * dataPerPage;
  const currentData = staffData.slice(firstIndexOfData, lastIndexOfData);


  return (
    <div>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} style={{ marginBottom: '16px' }}>
        <Link to='/addStaff'><Button variant='contained' color='primary' startIcon={<Add/>}>Add</Button></Link>
        </Grid>
        <Grid item xs={4} >  
          <TextField label="Search" 
          onChange={(e) => setSearchedVal(e.target.value)}
          value={searchedVal}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>
        
        <Grid item xs={4}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={20}>20 Per Page</MenuItem>
              <MenuItem value={100}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 1400 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="left">Staff name</StyledTableCell>
             <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Mobile</StyledTableCell>
              <StyledTableCell align="left">Gender</StyledTableCell>
              <StyledTableCell align="left">Qualification</StyledTableCell>
              <StyledTableCell align="left">Experience</StyledTableCell>
              <StyledTableCell align="left">Address</StyledTableCell>
              <StyledTableCell align="left">Department</StyledTableCell>
              <StyledTableCell align="left">Role</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentData.filter(search).map((row,index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index+1}
                </StyledTableCell>
                <StyledTableCell align="left">{row.staff_name}</StyledTableCell>
              
                <StyledTableCell align="left">{row.email}</StyledTableCell>
                <StyledTableCell align="left">{row.mobile}</StyledTableCell>
                <StyledTableCell align="left">{row.gender}</StyledTableCell>
                <StyledTableCell align="left">{row.qualification}</StyledTableCell>
                <StyledTableCell align="left">{row.experience}</StyledTableCell>
                <StyledTableCell align="left">{row.address}</StyledTableCell>
                <StyledTableCell align="left">{row.dept_name}</StyledTableCell>
                <StyledTableCell align="left">{row.role_name}</StyledTableCell>
                <StyledTableCell align="left">
                  <Button variant="contained" fullWidth color="info" startIcon={<Edit/>} onClick={() => handleUpdate(row.staff_id)}>
                    Edit
                  </Button>
                  <Button variant="contained" fullWidth color="error" startIcon={<Delete/>} onClick={() => handleDelete(row.staff_id)}>
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
      <Stack spacing={2} style={{ marginTop: "20px" }}>
        <Pagination count={Math.ceil(staffData.length / dataPerPage)} 
        page={currentPage} 
        onChange={handlePageChange} 
        variant="outlined"
        shape="circular" />
      </Stack>
      </Grid>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <UpdateStaff data={updateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllStaffs;
