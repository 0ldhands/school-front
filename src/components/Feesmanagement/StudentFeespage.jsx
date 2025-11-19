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
import { Button, TextField, Grid, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Edit } from '@mui/icons-material';
import Allotfees from './Allotfees'; 
import config from '../../config'; 

function StudentFeespage() {
  const { cls_id } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [className, setClassName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [allocUpdateData, setAllocUpdateData] = useState({});
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');

  useEffect(() => {
    if (cls_id) {
      Axios.get(`${config.apiURL}/feeAllocation/tutionfeesget/${cls_id}`)
        .then((res) => {
          setStudentData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error in fetching data: ' + (err.response?.data?.message || err.message));
          setLoading(false);
        });
    } else {
      setError('No class ID provided');
      setLoading(false);
    }
  }, [cls_id]);

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        setClassData(res.data);
        const foundClass = res.data.find((cls) => cls.cls_id === parseInt(cls_id));
        if (foundClass) {
          setClassName(foundClass.cls_name);
        } else {
          setClassName('Class not found');
        }
      })
      .catch((err) => {
        setError('Error fetching class data: ' + (err.response?.data?.message || err.message));
      });
  }, [cls_id]);

  const handleUpdate = (id) => {
    const selectedData = studentData.find((alloc) => alloc.stu_id === id);
    if (selectedData) {
      setAllocUpdateData(selectedData);
      setOpenUpdate(true);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    '&:last-child td, &:last-child th': {
      border: 0
    }
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
    return item.stu_name.toLowerCase().includes(searchValue);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>Fees Report for ${className}</h1>`);
    printWindow.document.write('<table border="1">');
    printWindow.document.write(
      '<thead><tr><th>S.no</th><th>Students Name</th><th>Tuition Fees</th><th>Booking Fees</th><th>1st installment</th><th>2nd installment</th><th>Pending Fees</th></tr></thead>'
    );
    printWindow.document.write('<tbody>');

    studentData &&
      studentData.filter(search).forEach((student, index) => {
        printWindow.document.write('<tr>');
        printWindow.document.write(`<td>${index + 1}</td>`);
        printWindow.document.write(`<td>${student.stu_name || ''}</td>`);
        printWindow.document.write(`<td>${student.tution_fees || ''}</td>`);
        printWindow.document.write(`<td>${student.bookingfees || ''}</td>`);
        printWindow.document.write(`<td>${student.firstinstallment || ''}</td>`);
        printWindow.document.write(`<td>${student.secondinstallment || ''}</td>`);
        printWindow.document.write(`<td style="color: red;">${student.pending_fees || ''}</td>`);
        printWindow.document.write('</tr>');
      });

    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Class: {className}</h2>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print All Data
          </Button>
        </Grid>
        <Grid item xs={4}>
          <TextField label="Search" onChange={(e) => setSearchedVal(e.target.value)} value={searchedVal} />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>


      <Grid container spacing={1} display="flex" justifyContent="center" marginTop={"30px"} className="mt-3">
  <Stack spacing={2}>
    <Pagination
      count={Math.ceil((studentData ? studentData.length : 0) / dataPerPage)}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      sx={{
        "& .MuiPaginationItem-root": {
          fontSize: "1.5rem", // Increases the size of the pagination buttons
          padding: "10px",   // Adds more padding
          "&:hover": {
            backgroundColor: "green", // Changes background color on hover
            color: "#1976d2",           // Changes text color on hover
          },
        },
      }}
    />
  </Stack>
</Grid>
<br />


      <TableContainer component={Paper} className="mt-3">
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell>Students Name</StyledTableCell>
              <StyledTableCell align="right">Tuition Fees</StyledTableCell>
              <StyledTableCell align="right">Booking Fees</StyledTableCell>
              <StyledTableCell align="right">1st installment</StyledTableCell>
              <StyledTableCell align="right">2nd installment</StyledTableCell>
              <StyledTableCell align="right">Pending Fees</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData &&
              studentData
                .filter(search)
                .slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage)
                .map((student, index) => (
                  <StyledTableRow key={student.stu_id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{student.stu_name}</StyledTableCell>
                    <StyledTableCell align="right">{student.tution_fees}</StyledTableCell>
                    <StyledTableCell align="right">{student.bookingfees}</StyledTableCell>
                    <StyledTableCell align="right">{student.firstinstallment}</StyledTableCell>
                    <StyledTableCell align="right">{student.secondinstallment}</StyledTableCell>
                    <StyledTableCell align="right" style={{ color: 'red' }}>
                      {student.pending_fees}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {student.pending_fees === 0 ? (
                        <span style={{ fontSize: 18, fontWeight: 'bolder', marginRight: '30px' }}>Paid</span>
                      ) : (
                        <Link to={`/payfees/${student.stu_id}`}>
                          <Button startIcon={<Edit />} variant="contained" color="info">
                            Pay fees
                          </Button>
                        </Link>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogContent>
          <Allotfees data={allocUpdateData} onClose={() => setOpenUpdate(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

  
    </div>
  );
}
export default StudentFeespage;
