import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, Select, MenuItem, TextField, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import config from "../../config";
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router';



const LastYearPendingFees= () => {
  const [stuData, setStuData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedVal, setSearchedVal] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [clsData, setClsData] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
   Axios.get(`${config.apiURL}/academicyear/getlastyearPendingStudents`)
      .then((res) => {
        console.log(res.data);
        setStuData(res.data);
        setTotalPages(Math.ceil(res.data.length / dataPerPage));
      })
      .catch((err) => {
        console.log("Error fetching students data", err);
      });
  }, [dataPerPage]);


 


 

  useEffect(() => {
    Axios.get(`${config.apiURL}/clsAndSec/getClass`)
      .then((res) => {
        console.log('Classes Response:', res.data);  // Ensure this has the correct data
        setClsData(res.data);
      })
      .catch((err) => {
        console.log('Error fetching classes:', err);
      });
  }, []);


  //search class name
  const getClassName = (classId) => {
    if (!clsData || clsData.length === 0) {
      console.log('Class data not loaded yet.');
      return 'N/A';  // Return 'N/A' if no class data
    }

    // Find the class data based on the classId
    const classData = clsData.find((cls) => cls.cls_id === classId);

    if (!classData) {
      console.log(`Class with ID ${classId} not found.`);
      return 'N/A';  // Return 'N/A' if no class data is found for the given classId
    }

    return classData.cls_name || 'N/A';  // Ensure there's a valid class name, else return 'N/A'
  };


  const handleChangeDataPerPage = (e) => {
    const newDataPerPage = parseInt(e.target.value, 10);
    setDataPerPage(newDataPerPage);
    setCurrentPage(1);
    setTotalPages(Math.ceil(stuData.length / newDataPerPage));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Export To Excel

  // const handleExcel = ()=>{
  //   const filteredData = stuData
  //   .filter(search)
  //   .map((row,index)=>({
  //     "S.NO":index+1,
  //     "Student Name": row.student_name,
  //     "van pending fees":row.vanRemaningFees,
  //     "ECA pending fees":row.ecaRemaningFees,
  //     "Scheme pending fees":row.schemeRemaningFees,
  //     "Tution pending fees":row.pending_fees,
  //     "Total pending fees":row.vanRemaningFees+row.ecaRemaningFees+row.schemeRemaningFees+row.pending_fees
  //   }))

  //   const worksheet = XLSX.utils.json_to_sheet(filteredData)

  //   const workbook = XLSX.utils.book_new()

  //   XLSX.utils.book_append_sheet(workbook,"Student")

  //   XLSX.writeFile(workbook,worksheet,"StudentDetails.xlsx")

  // }
  const handleExcel = () => {
    // Filter and map the data correctly
    const filteredData = stuData
      .filter(search)
      .map((row, index) => ({
        "S.NO": index + 1,
        "Student Name": row.stu_name,
        Class: getClassName(row.cls_id),
        "van pending fees": row.vanRemaningFees || 'N/A',
        "ECA pending fees": row.ecaRemaningFees || 'N/A',
        "Scheme pending fees": row.schemeRemaningFees || 'N/A',
        "Tution pending fees": row.pending_fees || 'N/A',
        "Total pending fees":
          (row.vanRemaningFees || 0) +
          (row.ecaRemaningFees || 0) +
          (row.schemeRemaningFees || 0) +
          (row.pending_fees || 0)
      }));

    // Create a worksheet from the filtered data
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Students");

    // Write the file with the correct file name
    XLSX.writeFile(workbook, "Pending_Student_Fees.xlsx");
  };

  //payments


  const handlepayfees = (row) => {
    if (row.pending_fees > 0 && row.pending_fees !== 'N/A') {
      navigate(`/Lastyearpayfees/${row.stu_id}`)
    }
    else if (row.vanRemaningFees > 0 && row.vanRemaningFees !== 'N/A') {
      navigate(`/LastyearVanfees/${row.stu_id}`)
    }
    else if (row.ecaRemaningFees > 0 && row.ecaRemaningFees !== 'N/A') {
      navigate(`/LastyearEcafees/${row.stu_id}`)

    }
    else if (row.schemeRemaningFees > 0 && row.schemeRemaningFees !== 'N/A') {
      navigate(`/LastyearSchemefees/${row.stu_id}`)
    }
    else {
      alert('No Pending Fees to Pay!')
    }
  }

  // const handlepayfees = (row) => {
  //   if (row.pending_fees != 0 ) {
  //     return <Link to={`/payfees/${row.stu_id}`} />
  //   }
  //   else if (row.vanRemaningFees != 0 || row.vanRemaningFees != 'N/A' ) {
  //     return <Link to={`/vanpayfees/${row.stu_id}`} />
  //   }
  //   else if (row.ecaRemaningFees != 0  || row.ecaRemaningFees != 'N/A') {
  //     return <Link to={`/ecapayfees/${row.stu_id}`} />
  //   }
  //   else if (row.schemeRemaningFees != 0  || row.schemeRemaningFees != 'N/A' ) {
  //     return <Link to={`/schemepayfees/${row.stu_id}`} />
  //   }
  //   else {
  //     alert('No Pending Fees to Pay!')
  //   }
  // }










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

  const filteredData = stuData.filter(search);

  // Function to count the pending students based on the search value
  const countPendingStudentsByClass = () => {
    if (!searchedVal) return 0;  // If no search value, return 0

    // Filter the students based on the searched value
    const filtered = stuData.filter(stu =>
      getClassName(stu.cls_id).toLowerCase().includes(searchedVal.toLowerCase()) ||
      stu.stu_name.toLowerCase().includes(searchedVal.toLowerCase()) || // Check student name as well
      stu.stu_id.toString().includes(searchedVal) // Include student ID
    );

    return filtered.length;  // Return the length of the filtered data
  };



  const displayedData = dataPerPage === 0 ? filteredData : filteredData.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);

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

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>@media print { .no-print { display: none; } }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.getElementById('printableArea').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div>
      <h1 className='text-center'>Pending Students</h1>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={3}>
          <Button variant="contained" color="primary" onClick={handlePrint} className="no-print">
            Print
          </Button>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Search"
            onChange={(e) => setSearchedVal(e.target.value)}
            value={searchedVal}
          // fullWidth

          />

        </Grid>
        <Grid item xs={3}>
          <FormControl >
            <Select value={dataPerPage} onChange={handleChangeDataPerPage}>
              <MenuItem value={5}>5 Per Page</MenuItem>
              <MenuItem value={10}>10 Per Page</MenuItem>
              <MenuItem value={15}>15 Per Page</MenuItem>
              <MenuItem value={20}>20 Per Page</MenuItem>
              <MenuItem value={0}>All</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='success'
            onClick={handleExcel}
          >
            Export To Excel
          </Button>
        </Grid>
      </Grid>

      {/* Show the pending students count based on the search */}
      <div className="text-center mt-3">
        {searchedVal && (
          <h4>{countPendingStudentsByClass()} Pending Students Found for "{searchedVal}"</h4>
        )}
      </div>


      <TableContainer component={Paper} className='mt-3' id="printableArea">
        <Table sx={{ minWidth: 700 }} aria-label="customized table" style={{ marginTop: "10px" }} align="left">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell align="left">Student Name</StyledTableCell>
              {/* <StyledTableCell align="left">Student ID</StyledTableCell> */}
              <StyledTableCell align="left">Class Name</StyledTableCell>
              <StyledTableCell align="left">van pending fees</StyledTableCell>
              <StyledTableCell align="left">eca pending fees</StyledTableCell>
              <StyledTableCell align="left">schema pending fees</StyledTableCell>
              <StyledTableCell align="left">tution Pending Fees</StyledTableCell>
              <StyledTableCell align="left">total pending fees</StyledTableCell>
              <StyledTableCell align="left">pay fees</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <StyledTableRow key={row.stu_id}>
                <StyledTableCell>{dataPerPage === 0 ? index + 1 : (currentPage - 1) * dataPerPage + index + 1}</StyledTableCell>
                <StyledTableCell align="left">{row.stu_name}</StyledTableCell>
                {/* <StyledTableCell align="left">{row.stu_id}</StyledTableCell> */}
                <StyledTableCell align="left">{getClassName(row.cls_id)}</StyledTableCell>
                <StyledTableCell align="left" style={{ color: row.vanRemaningFees ? 'red' : 'green' }}>{row.vanRemaningFees || 'N/A'}</StyledTableCell>
                <StyledTableCell align="left" style={{ color: row.ecaRemaningFees ? 'red' : 'green' }} >{row.ecaRemaningFees || 'N/A'}                </StyledTableCell>
                <StyledTableCell align="left" style={{ color: row.schemeRemaningFees ? 'red' : 'green' }} >{row.schemeRemaningFees || 'N/A'}</StyledTableCell>
                <StyledTableCell align="left" style={{ color: row.pending_fees ? 'red' : 'green' }} >{row.pending_fees || 'N/A'}</StyledTableCell>
                <StyledTableCell align="left" style={{ color: 'red' }} >{row.vanRemaningFees + row.ecaRemaningFees + row.schemeRemaningFees + row.pending_fees}</StyledTableCell>
                <StyledTableCell align='left' >
                  <Button
                    variant='contained'
                    color='info'
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => handlepayfees(row)}
                  >
                    Pay Now
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dataPerPage !== 0 && (
        <Grid container spacing={1} justifyContent="center" className='mt-3'>
          <Stack spacing={2} style={{ marginTop: "20px" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="circle"
            />
          </Stack>
        </Grid>
      )}
    </div>
  );
};

export default LastYearPendingFees;