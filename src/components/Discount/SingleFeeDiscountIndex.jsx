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
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Link } from 'react-router-dom';
import config  from '../../config';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditDiscount from './EditDiscount';

function SingleFeeDiscountIndex() {
  const [discountData,setDiscountData] = useState([]);
  const {fees_id} = useParams();
  const [updateData,setUpdateData] = useState([]);
  const [openDiscount,setOpenDiscount] = useState(false);

  useEffect(()=>{
    axios.get(`${config.apiURL}/discount/getDiscountByFeesId/${fees_id}`)
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

 

  return (
    <div>
      <TableContainer component={Paper}>
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
            {discountData.map((dis,index) => (
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

export default SingleFeeDiscountIndex;