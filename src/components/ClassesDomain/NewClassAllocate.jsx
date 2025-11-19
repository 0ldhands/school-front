// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Button,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Snackbar,
//   Alert,
//   IconButton,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import config from '../../config';

// function ClassSectionAllocation() {
//   const [allocations, setAllocations] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [clsId, setClsId] = useState('');
//   const [secIds, setSecIds] = useState([]);
//   const [academicYear, setAcademicYear] = useState('');
//   const [editingAllocation, setEditingAllocation] = useState(null);

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   useEffect(() => {
//     fetchAllocations();
//     fetchClasses();
//     fetchSections();
//   }, []);

//   const fetchAllocations = async () => {
//     try {
//       const response = await axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocation`);
//       setAllocations(response.data);
//     } catch (err) {
//       console.error('Error fetching allocations:', err);
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await axios.get(`${config.apiURL}/clsAndSec/getClass`);
//       setClasses(response.data);
//     } catch (err) {
//       console.error('Error fetching classes:', err);
//     }
//   };

//   const fetchSections = async () => {
//     try {
//       const response = await axios.get(`${config.apiURL}/clsAndSec/getSection`);
//       setSections(response.data);
//     } catch (err) {
//       console.error('Error fetching sections:', err);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const payload = { cls_id: clsId, sec_ids: secIds, academic_year: academicYear };

//       if (editingAllocation) {
//         // Update existing allocation
//         await axios.put(`${config.apiURL}/clsAndSec/updateClassAndSecAllocation/${editingAllocation.cls_allocation_id}`, payload);
//         setSnackbarMessage('Allocation updated successfully');
//       } else {
//         // Create new allocation
//         await axios.post(`${config.apiURL}/clsAndSec/saveClassAndSecAllocation`, payload);
//         setSnackbarMessage('Allocation created successfully');
//       }

//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//       fetchAllocations();
//       resetForm();
//     } catch (err) {
//       console.error('Error saving allocation:', err);
//       setSnackbarMessage('Failed to save allocation');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleDelete = async (clsAllocationId) => {
//     try {
//       await axios.delete(`${config.apiURL}/clsAndSec/deleteClassAndSecAllocation/${clsAllocationId}`);
//       setSnackbarMessage('Allocation deleted successfully');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//       fetchAllocations();
//     } catch (err) {
//       console.error('Error deleting allocation:', err);
//       setSnackbarMessage('Failed to delete allocation');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const resetForm = () => {
//     setClsId('');
//     setSecIds([]);
//     setAcademicYear('');
//     setEditingAllocation(null);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleEdit = (allocation) => {
//     setClsId(allocation.cls_id);
//     setSecIds([allocation.sec_id]); // This assumes you're only editing one section at a time
//     setAcademicYear(allocation.academic_year);
//     setEditingAllocation(allocation);
//   };

//   return (
//     <div>
//       <h2>Class and Section Allocation</h2>
//       <form noValidate autoComplete="off">
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Class</InputLabel>
//           <Select value={clsId} onChange={(e) => setClsId(e.target.value)}>
//             {classes.map((cls) => (
//               <MenuItem key={cls.cls_id} value={cls.cls_id}>
//                 {cls.cls_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl fullWidth margin="normal">
//           <InputLabel>Sections</InputLabel>
//           <Select multiple value={secIds} onChange={(e) => setSecIds(e.target.value)} renderValue={(selected) => selected.join(', ')}>
//             {sections.map((sec) => (
//               <MenuItem key={sec.sec_id} value={sec.sec_id}>
//                 {sec.sec_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} fullWidth margin="normal" />
//         <Button variant="contained" color="primary" onClick={handleSave}>
//           {editingAllocation ? 'Update Allocation' : 'Save Allocation'}
//         </Button>
//       </form>

//       <h3>Allocations</h3>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Class Name</TableCell>
//               <TableCell>Section Names</TableCell>
//               <TableCell>Academic Year</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {allocations.map((allocation) => (
//               <TableRow key={allocation.cls_allocation_id}>
//                 <TableCell>{allocation.cls_name}</TableCell>
//                 <TableCell>{allocation.sec_name}</TableCell>
//                 <TableCell>{allocation.academic_year}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(allocation)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(allocation.cls_allocation_id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Snackbar for success and error messages */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// export default ClassSectionAllocation;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import config from '../../config';

function ClassSectionAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [clsId, setClsId] = useState('');
  const [secIds, setSecIds] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [editingAllocation, setEditingAllocation] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchAllocations();
    fetchClasses();
    fetchSections();
  }, []);

  const fetchAllocations = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocation`);
      setAllocations(response.data);
    } catch (err) {
      console.error('Error fetching allocations:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getClass`);
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${config.apiURL}/clsAndSec/getSection`);
      setSections(response.data);
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { cls_id: clsId, sec_ids: secIds, academic_year: academicYear };

      if (editingAllocation) {
        await axios.put(`${config.apiURL}/clsAndSec/updateClassAndSecAllocation/${editingAllocation.cls_allocation_id}`, payload);
        setSnackbarMessage('Allocation updated successfully');
      } else {
        await axios.post(`${config.apiURL}/clsAndSec/saveClassAndSecAllocation`, payload);
        setSnackbarMessage('Allocation created successfully');
      }

      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchAllocations();
      resetForm();
    } catch (err) {
      console.error('Error saving allocation:', err);
      setSnackbarMessage('Failed to save allocation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (clsAllocationId) => {
    try {
      await axios.delete(`${config.apiURL}/clsAndSec/deleteClassAndSecAllocation/${clsAllocationId}`);
      setSnackbarMessage('Allocation deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchAllocations();
    } catch (err) {
      console.error('Error deleting allocation:', err);
      setSnackbarMessage('Failed to delete allocation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setClsId('');
    setSecIds([]);
    setAcademicYear('');
    setEditingAllocation(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = (allocation) => {
    setClsId(allocation.cls_id);
    setSecIds([allocation.sec_id]);
    setAcademicYear(allocation.academic_year);
    setEditingAllocation(allocation);
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Class and Section Allocation
      </Typography>

      <Card elevation={4} sx={{ margin: '20px', padding: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingAllocation ? 'Edit Allocation' : 'Create New Allocation'}
          </Typography>
          <form noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select value={clsId} onChange={(e) => setClsId(e.target.value)}>
                    {classes.map((cls) => (
                      <MenuItem key={cls.cls_id} value={cls.cls_id}>
                        {cls.cls_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Sections</InputLabel>
                  <Select
                    multiple
                    value={secIds}
                    onChange={(e) => setSecIds(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {sections.map((sec) => (
                      <MenuItem key={sec.sec_id} value={sec.sec_id}>
                        {sec.sec_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <CalendarTodayIcon sx={{ marginRight: '8px' }} />,
                  }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ marginTop: '20px' }}
            >
              {editingAllocation ? 'Update Allocation' : 'Save Allocation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card elevation={4} sx={{ margin: '20px', padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Allocations
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Class Name</b></TableCell>
                <TableCell><b>Section Names</b></TableCell>
                <TableCell><b>Academic Year</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((allocation) => (
                <TableRow key={allocation.cls_allocation_id}>
                  <TableCell>{allocation.cls_name}</TableCell>
                  <TableCell>{allocation.sec_name}</TableCell>
                  <TableCell>{allocation.academic_year}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(allocation)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(allocation.cls_allocation_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ClassSectionAllocation;
