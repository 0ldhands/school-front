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
import { Button, Dialog, DialogActions, DialogContent, FormControl, Grid, Select, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import config  from '../../config';
import axios from 'axios';
import EditDiscount from './EditDiscount';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function DiscountIndex() {
  const [discountData,setDiscountData] = useState([]);
  const [updateData,setUpdateData] = useState([]);
  const [openDiscount,setOpenDiscount] = useState(false);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(()=>{
    axios.get(`${config.apiURL}/discount/getDiscount`)
    .then((res)=>{
      setDiscountData(res.data)
    })
    .catch((err)=>{
      console.log("Error fetching discount data.")
    })
  },[openDiscount]);

  

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

  const handleUpdate = (id) =>{
    const selectData = discountData.find((dis)=>dis.discount_id === id)
    if(selectData){
      setUpdateData(selectData);
      setOpenDiscount(true);
    }
  }


  
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
  const currentData = discountData.slice(firstIndexOfData, lastIndexOfData);

 

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
        
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <option value={5}>5 Per Page</option>
              <option value={10}>10 Per Page</option>
              <option value={15}>15 Per Page</option>
              <option value={20}>20 Per Page</option>
              <option value={0}>All Per Page</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              
              <StyledTableCell align="right">Student name</StyledTableCell>
              <StyledTableCell align="right">Roll Number</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Class Name</StyledTableCell>
              <StyledTableCell align="right">Section Name</StyledTableCell>
              <StyledTableCell align="right">Fees Category</StyledTableCell>
              <StyledTableCell align="right">Fees Amount</StyledTableCell>
              <StyledTableCell align="right">discount amount</StyledTableCell>
              <StyledTableCell align="right">discount percentage</StyledTableCell>
              <StyledTableCell align="right">Reason</StyledTableCell>
              <StyledTableCell align="right">Academic Year</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentData.filter(search).map((dis,index) => (
              <StyledTableRow key={dis.discount_id}>
                <StyledTableCell>S.no</StyledTableCell>
              
              <StyledTableCell align="right">{dis.stu_name}</StyledTableCell>
              <StyledTableCell align="right">{dis.roll_no}</StyledTableCell>
              <StyledTableCell align="right">
              <img src={dis.stu_img} height='50' width='50'/>
              </StyledTableCell>
              <StyledTableCell align="right">{dis.cls_name}</StyledTableCell>
              <StyledTableCell align="right">{dis.sec_name}</StyledTableCell>
              <StyledTableCell align="right">{dis.fee_category}</StyledTableCell>
              <StyledTableCell align="right">{dis.amount}</StyledTableCell>
              <StyledTableCell align="right">{dis.discount_amount}</StyledTableCell>
              <StyledTableCell align="right">{dis.discount_percentage}</StyledTableCell>
              <StyledTableCell align="right">{dis.reason}</StyledTableCell>
              <StyledTableCell align="right">{dis.academic_year}</StyledTableCell>
              <StyledTableCell align="right"><Button onClick={()=>handleUpdate(dis.discount_id)}>Edit</Button></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
      <Stack spacing={2}>
        <Pagination count={Math.ceil(discountData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
      </Stack>
      </Grid>

      <Dialog open={openDiscount} onClose={()=>setOpenDiscount(false)}>
        <DialogContent>
          <EditDiscount data={updateData} onClose={()=>setOpenDiscount(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDiscount(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DiscountIndex;