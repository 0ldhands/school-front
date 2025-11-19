import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useParams } from 'react-router-dom';
import config from '../../config';
import { Button } from '@mui/material';

function Feesslip() {
  const { stu_id } = useParams();
  const [slip, setSlip] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiURL}/feeAllocation/feesslip/${stu_id}`)
      .then((res) => {
        setSlip(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [stu_id]);

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

  return (
    <div>
      <h2>Fee Slip Details</h2>
      <TableContainer component={Paper} className='mt-3'>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell align="right">Paying Fee</StyledTableCell>
              <StyledTableCell align="right">Remaining Fee</StyledTableCell>
              <StyledTableCell align="right">Fee Date</StyledTableCell>
              <StyledTableCell align="right">Scheme Amount</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slip.map((item) => (
              <StyledTableRow key={item.feeslogid}>
                <StyledTableCell>{item.stu_name}</StyledTableCell>
                <StyledTableCell align="right">{item.payingfee}</StyledTableCell>
                <StyledTableCell align="right">{item.remainingfee}</StyledTableCell>
                <StyledTableCell align="right">{new Date(item.feedate).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell align="right">{item.scheme}</StyledTableCell>
                <StyledTableCell align="right">
                  <Link to={`/invoice/${item.feeslogid}`}>
                    <Button style={{ marginTop: "20px", marginLeft: "10px" }} variant='contained' color='info'>Print</Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Feesslip;
