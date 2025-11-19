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
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Link } from 'react-router-dom';
import Updatefees from './Updatefees';
import PayFeesLog from './PayFeesLog';
import AddDiscount from 'components/Discount/AddDiscount';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function Feespay() {
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openFees, setOpenFees] = useState(false);
  const [dlt, setDlt] = useState(false);
  const [updateData, setUpdateData] = useState();
  const [checkData, setCheckData] = useState();
  const [checkedData, setCheckedData] = useState();
  const [payData, setPayData] = useState();
  const [discountData,setDiscountData] = useState([]);
  const [openDiscount,setOpenDiscount] = useState(false);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    Axios.get(`${config.apiURL}/feeAllocation/getFeesAllocation`)
      .then((res) => {
        setFeeData(res.data);
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
    const selectData = feeData.find((fee) => fee.fees_id === id);
    if (selectData) {
      setUpdateData(selectData);
      setOpenUpdate(true);
    }
  };

  useEffect(()=>{
      
    Axios.get(`${config.apiURL}/feeLogs/getFeesLogs`)
    .then((res)=>{
      setCheckData(res.data)
      console.log('checked ');
    })
    .catch((err)=>{
      console.log('not checked')
    })

  },[])
  
  const handleCheck=(id)=>{
    navigate(`/feeLogsByFeeId/${id}`)
  }  

const handlePay = (id) =>{
  const selectData = feeData.find((fee)=>fee.fees_id === id);
  if(selectData){
    setPayData(selectData);
    setOpenFees(true);
  }
}


const handleDiscount = (id) =>{
  const selectData = feeData.find((fee)=>fee.fees_id === id);
  if(selectData){
    setDiscountData(selectData);
    setOpenDiscount(true);
  }
}



  

  // const handleDlt = (id) => {
  //   Axios.delete(`${config.apiURL}/feeAllocation/deleteFeesAllocation/${id}`)
  //     .then((res) => {
  //       console.log('Deleted successfully :');
  //       setDlt(true);
  //     })
  //     .catch((err) => {
  //       console.log('Error:', err);
  //     });
  // };

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
        <Link to='/feesapplication'> <Button variant="contained" color="primary" >Add</Button></Link>
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
              <StyledTableCell align="right">Student Name</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Class</StyledTableCell>
              <StyledTableCell align="right">Section</StyledTableCell>
              <StyledTableCell>Roll No</StyledTableCell>
              <StyledTableCell align="right">Academic Year</StyledTableCell>
              <StyledTableCell align="right">Fee Category</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="right">Pay</StyledTableCell>
              <StyledTableCell align="right">Discount</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentData.filter(search).map((row) => (
              
              <StyledTableRow key={row.fees_id}>
                <StyledTableCell align="right">{row.stu_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <img src={row.stu_img} height="50" width="50" alt="Student" />
                </StyledTableCell>
                <StyledTableCell align="right">{row.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{row.sec_name}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.roll_no}
                </StyledTableCell>
                <StyledTableCell align="right">{row.academic_year}</StyledTableCell>
                <StyledTableCell align="right">{row.fee_category}</StyledTableCell>
                <StyledTableCell align="right">{row.amount}</StyledTableCell>
                <StyledTableCell align="right">
                <Button variant="contained" color="primary"  onClick={()=>handlePay(row.fees_id)}>
                    Pay
                </Button>
                 
                  <Button variant="contained" color="secondary" onClick={() => handleCheck(row.fees_id)}>
                    feesLog
                    </Button>
                  </StyledTableCell>
                <StyledTableCell align="right">
                <Button variant="contained" color="primary"  onClick={()=>handleDiscount(row.fees_id)}>
                    Discount
                </Button>
                 
                  <Button variant="contained" color="secondary" onClick={() => handleCheck(row.fees_id)}>
                    Discount Log
                    </Button>
                  </StyledTableCell>
                <StyledTableCell align="right">
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(row.fees_id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDlt(row.fees_id)}>
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
        <Updatefees data ={updateData} onClose={()=>setOpenUpdate(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFees} onClose={() => setOpenFees(false)}>
        <DialogContent>
        <PayFeesLog data ={payData} onClose={()=>setOpenFees(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFees(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDiscount} onClose={() => setOpenDiscount(false)}>
        <DialogContent>
        <AddDiscount data ={discountData} onClose={()=>setOpenDiscount(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDiscount(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Feespay;
