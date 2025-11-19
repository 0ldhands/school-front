import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, Select, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const SiblingStudentsIndex = () =>{
    const [siblingData,setSiblingData] = useState([]);
    const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

    useEffect(()=>{
        axios.get(`${config.apiURL}/students/getSiblings`)
        .then((res)=>{
            setSiblingData(res.data.siblingsData)
        })
        .catch((err)=>{
            console.log("Error fetching Sibling data")
        })
    },[]);

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
      const currentData = siblingData.slice(firstIndexOfData, lastIndexOfData);
    

    return(
        <>
        <Grid container spacing={3}>
        <Grid item xs={4}></Grid>
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
              <StyledTableCell>Student Name</StyledTableCell>
              <StyledTableCell align="right">Student Image</StyledTableCell>
              <StyledTableCell align="right">Roll Number</StyledTableCell>
              <StyledTableCell align="right">Class Name</StyledTableCell>
              <StyledTableCell align="right">Section</StyledTableCell>
              <StyledTableCell align="right">Father Name</StyledTableCell>
              <StyledTableCell align="right">Mother Name</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.filter(search).map((sibling,index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {sibling.stu_name}
                </StyledTableCell>
                <StyledTableCell align="right"> <img src={sibling.stu_img} height='50' width='50'/></StyledTableCell>
                <StyledTableCell align="right">{sibling.roll_no}</StyledTableCell>
                <StyledTableCell align="right">{sibling.cls_name}</StyledTableCell>
                <StyledTableCell align="right">{sibling.sec_name}</StyledTableCell>
                <StyledTableCell align="right">{sibling.father_name}</StyledTableCell>
                <StyledTableCell align="right">{sibling.mother_name}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={1} display='flex' justifyContent='center' className='mt-3'>
      <Stack spacing={2}>
        <Pagination count={Math.ceil(siblingData.length / dataPerPage)} page={currentPage} onChange={handlePageChange} variant="outlined" />
      </Stack>
      </Grid>
        </>
    )

}
export default SiblingStudentsIndex;