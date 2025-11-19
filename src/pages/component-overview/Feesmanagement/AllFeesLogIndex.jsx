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

import config from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import FeesEditStud from './FeesEditStud';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function AllFeesLogIndex() {
  const [feeData, setFeeData] = useState([]);
  const [editFee, setEditFee] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [selectedData, setSelectedData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`${config.apiURL}/feeLogs/getFeesLogs`)
      .then((res) => {
        setFeeData(res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, [openUpdate]);

  const handleEditFee = (id) => {
    const selectData = feeData.find((log) => log.log_id === id);
    if (selectData) {
      setEditFee(selectData);
      setOpenUpdate(true);
    }
  };

  const handleSelectData = (id) => {
    setSelectedData((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSendToInvoice = () => {
    const selectedFees = feeData.filter((log) => selectedData.includes(log.log_id));
    navigate('/invoice', { state: { data: selectedFees } });
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
  const currentData = feeData.slice(firstIndexOfData, lastIndexOfData);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
        <Button variant="contained" color="primary" onClick={handleSendToInvoice}>
        Print
      </Button>
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value="5">5 Per Page</MenuItem>
              <MenuItem value="10">10 Per Page</MenuItem>
              <MenuItem value="15">15 Per Page</MenuItem>
              <MenuItem value={feeData.length}>All Per Page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Select</StyledTableCell>
              <StyledTableCell align="right">S.No</StyledTableCell>
              <StyledTableCell align="right">Student Name</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Class</StyledTableCell>
              <StyledTableCell align="right">Section</StyledTableCell>
              <StyledTableCell>Roll No</StyledTableCell>
              <StyledTableCell align="right">Academic Year</StyledTableCell>
              <StyledTableCell align="right">Fee Category</StyledTableCell>
              <StyledTableCell align="right">Fees Amount</StyledTableCell>
              <StyledTableCell align="right">Paid Amount</StyledTableCell>
              <StyledTableCell align="right">Paid Date</StyledTableCell>
              <StyledTableCell align="right">Paid Method</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.filter(search).map((fee, index) => (
              <StyledTableRow key={fee.log_id}>
                <StyledTableCell align="right">
                  <Checkbox
                    checked={selectedData.includes(fee.log_id)}
                    onChange={() => handleSelectData(fee.log_id)}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{index + 1}</StyledTableCell>
                <StyledTableCell align="right">{fee.stu_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <img src={fee.stu_img} height="50" width="50" alt="Student" />
                </StyledTableCell>
                <StyledTableCell align="right">{fee.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{fee.sec_name}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {fee.roll_no}
                </StyledTableCell>
                <StyledTableCell align="right">{fee.academic_year}</StyledTableCell>
                <StyledTableCell align="right">{fee.fee_category}</StyledTableCell>
                <StyledTableCell align="right">{fee.amount}</StyledTableCell>
                <StyledTableCell align="right">{fee.paid_amount}</StyledTableCell>
                <StyledTableCell align="right">{fee.payment_date}</StyledTableCell>
                <StyledTableCell align="right">{fee.payment_method}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button variant="contained" color="primary" onClick={() => handleEditFee(fee.log_id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary">
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
        <Stack spacing={2}>
          <Pagination count={Math.ceil(feeData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
        </Stack>
      </Grid>
      

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <FeesEditStud data={editFee} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AllFeesLogIndex;
