import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../config';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Root = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  maxWidth: 600,
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
    cursor: 'pointer',
  },
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const CardContentInfo = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

const InfoRow = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

function ViewStudents() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [className, setClassName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeDetails, setFeeDetails] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch students and class name
  useEffect(() => {
    axios
      .get(`${config.apiURL}/students/${classId}`)
      .then((res) => {
        setStudents(res.data);
        setFilteredStudents(res.data);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
      });

    axios
      .get(`${config.apiURL}/clsAndSec/getClass/${classId}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setClassName(res.data[0].cls_name);
        } else {
          console.log('cls_name not found in the response');
        }
      })
      .catch((err) => {
        console.error('Error fetching class name:', err);
      });
  }, [classId]);

  // Search functionality
  useEffect(() => {
    const results = students.filter((student) =>
      student.stu_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  // Fetch fee details when a student card is clicked
  const handleCardClick = (student) => {
    setSelectedStudent(student);
    axios
      .get(`${config.apiURL}/fees/${student.stu_id}`)
      .then((res) => {
        setFeeDetails(res.data);
        setOpenDialog(true); // Open the dialog box
      })
      .catch((err) => console.error('Error fetching fee details:', err));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setFeeDetails([]);
  };

  return (
    <Root>
      <Header>
        <Typography variant="h4" component="h1" gutterBottom>
          {className} Students
        </Typography>
        <SearchField
          label="Search by name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>
      <Grid container spacing={3}>
        {filteredStudents.map((student) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={student.stu_id}
            onClick={() => handleCardClick(student)}
          >
            <StyledCard>
              <CardHeader
                avatar={<AvatarStyled>{student.stu_name.charAt(0)}</AvatarStyled>}
                title={<Typography variant="h6">{student.stu_name}</Typography>}
                subheader={`Section: ${student.section}`}
              />
              <CardContentInfo>
                <InfoRow>Father Name: {student.father_name}</InfoRow>
                <InfoRow>Father Mobile: {student.father_mobile}</InfoRow>
                <InfoRow>Gender: {student.gender}</InfoRow>
                <InfoRow>DOB: {formatDate(student.dob)}</InfoRow>
              </CardContentInfo>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Box for Fee Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Fee Details for {selectedStudent ? selectedStudent.stu_name : ''}
        </DialogTitle>
        <DialogContent>
          {feeDetails.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Date</TableCell>
                    <TableCell>Paying Fee</TableCell>
                    <TableCell>Remaining Fee</TableCell>
                    <TableCell>Payment Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeDetails.map((fee) => (
                    <TableRow key={fee.feeslogid}>
                      <TableCell>{formatDate(fee.feedate)}</TableCell>
                      <TableCell>{fee.payingfee}</TableCell>
                      <TableCell>{fee.remainingfee}</TableCell>
                      <TableCell>{fee.payment_method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No fee details available for this student.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Root>
  );
}

export default ViewStudents;