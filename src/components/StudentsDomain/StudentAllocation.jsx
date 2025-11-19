
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
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import EditAlloc from './EditAlloc';
import config from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Add, Edit } from '@mui/icons-material';

function StudentAllocation() {
  const { cls_id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [section, setSection] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allocUpdateData, setAllocUpdateData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    if (cls_id) {
      Axios.get(`${config.apiURL}/stuAllocation/studentport/${cls_id}`)
        .then((res) => {
          setStudentData(res.data);
        })
        .catch((err) => {
          setError("Error in fetching data: " + (err.response?.data?.message || err.message));
        });
    } else {
      setError("No class ID provided");
    }
  }, [cls_id]);

  useEffect(() => {
    if (cls_id) {
      Axios.get(`${config.apiURL}/stuAllocation/getsecalloc/${cls_id}`)
        .then((res) => {
          setSection(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cls_id]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/stuAllocation/staffs`)
      .then((res) => {
        setStaffs(res.data);
      })
      .catch((err) => {
        console.error('Error fetching staffs:', err);
      });
  }, []);

  const handleUpdate = (id) => {
    const selectedData = studentData.find((alloc) => alloc.stu_allocation_id === id);
    if (selectedData) {
      setAllocUpdateData(selectedData);
      setOpenUpdate(true);
    }
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

  const handleChangeSection = (event) => {
    const selectedSection = section.find(sec => sec.sec_id === event.target.value);
    setSelectedSection(selectedSection.sec_id);
    setSelectedSectionName(selectedSection.sec_name);
  };

  const handleChangeStaff = (event) => {
    setSelectedStaff(event.target.value);
  };

  const handleSelect = (index) => {
    const updatedData = [...studentData];
    updatedData[index].selected = !updatedData[index].selected;
    setStudentData(updatedData);
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
  const currentData = studentData ? studentData.slice(firstIndexOfData, lastIndexOfData) : [];

  const handleSectionAssignment = () => {
    const selectedStudentsIds = currentData.filter((alloc) => alloc.selected).map((alloc) => alloc.stu_id);
    console.log("selected students:", selectedStudentsIds);
    console.log("selected section:", selectedSection);
    console.log("selected section name:", selectedSectionName);
    console.log("selected staff:", selectedStaff);

    Axios.post(`${config.apiURL}/stuAllocation/assignSection`, {
      selectedStudentsIds,
      selectedSectionName,
      selectedStaff
    })
    .then((res) => {
      alert('Section and staff assigned successfully');
      // Refresh or update student data after assigning section if needed
    })
    .catch((err) => {
      console.error('Error assigning section and staff:', err);
      alert('Failed to assign section and staff');
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Link to={'/allocation'}>
            <Button variant="contained" startIcon={<Add />} color="primary">Allocate</Button>
          </Link>
          <FormControl fullWidth>
            <Select
              value={selectedSection}
              onChange={handleChangeSection}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Section' }}
            >
              <MenuItem value="" disabled>
                Select Section
              </MenuItem>
              {section.map((sec) => (
                <MenuItem key={sec.sec_id} value={sec.sec_id}>
                  {sec.sec_name} {/* Use sec_id and sec_name */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              value={selectedStaff}
              onChange={handleChangeStaff}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Staff' }}
            >
              <MenuItem value="" disabled>
                Select Staff
              </MenuItem>
              {staffs.map((staff) => (
                <MenuItem key={staff.staff_id} value={staff.staff_id}>
                  {staff.staff_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSectionAssignment}
            style={{marginBottom:'10px'}}
            disabled={!selectedSection || !selectedStaff || currentData.filter((alloc) => alloc.selected).length === 0}
          >
            Assign Section & Staff
          </Button>
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
         
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Select</StyledTableCell>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.filter(search).map((alloc, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell padding="checkbox">
                  <Checkbox checked={alloc.selected} onChange={() => handleSelect(index)} />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">{alloc.stu_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button style={{ marginTop: "20px", marginLeft: "10px" }} onClick={() => handleUpdate(alloc.stu_allocation_id)} startIcon={<Edit />} variant='contained' color='info'>Edit</Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <EditAlloc data={allocUpdateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
        <Stack spacing={2} style={{ marginTop: "20px" }}>
          <Pagination count={Math.ceil((studentData ? studentData.length : 0) / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" shape='circle' />
        </Stack>
      </Grid>
    </div>
  );
}

export default StudentAllocation;
