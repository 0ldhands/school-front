// import { useEffect, useState } from 'react';
// import { Grid, Typography, Box, Button, TextField } from '@mui/material';
// import axios from 'axios';
// import config from '../../config';
// import { PiStudent } from 'react-icons/pi';
// import { IoPeopleSharp } from 'react-icons/io5';
// import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
// import { Link, useNavigate } from 'react-router-dom';
// import FeeCollectionChart from './IncomeAreaChart';

// const styles = {
//   box: {
//     fontWeight: 'bold',
//     height: '130px',
//     width: '100%',
//     borderRadius: '15px',
//     padding: '10px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     transition: 'transform 0.3s, background-color 0.3s',
//     backgroundColor: '#9EA0D8', // Initial color
//     '&:hover': {
//       transform: 'scale(1.05)',
//       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//       backgroundColor: '#FFC0CB' // Color on hover
//     }
//   },
//   link: {
//     color: 'white',
//     textDecoration: 'none'
//   },
//   icon: {
//     height: '70px',
//     width: '70px',
//     color: 'blue'
//   },
//   logoutButton: {
//     position: 'absolute',
//     backgroundColor: 'black',
//     color: 'white',
//     top: '35px',
//     right: '10px',
//     zIndex: 1000 // Ensure it stays on top
//   }
// };

// export default function SuperDashboardDefault() {
//   const [studentsCount, setStudentsCount] = useState(0);
//   const [staffsCount, setStaffsCount] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [selectedYear, setSelectedYear] = useState('2024-2025');
//   const [studentPresent, setStudentPresent] = useState(0);
//   const [staffPresent, setStaffPresent] = useState(0);
//   const [siblingsCount, setSiblingCount] = useState(0);
//   const [siblingsData, setSiblingData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${config.apiURL}/staffs/getStaffs`)
//       .then((res) => {
//         setStaffsCount(res.data.length);
//       })
//       .catch((error) => {
//         console.error('Error fetching staff:', error);
//       });

//     axios
//       .get(`${config.apiURL}/students/getStudentsCount`)
//       .then((res) => {
//         setStudentsCount(res.data.total_count);
//       })
//       .catch((error) => {
//         console.error('Error fetching student count:', error);
//       });

//     axios
//       .get(`${config.apiURL}/dashboard/totalPaidAmount/${selectedYear}`)
//       .then((res) => {
//         setTotalRevenue(res.data.total_paid_amount);
//       })
//       .catch((error) => {
//         console.error('Error fetching revenue:', error);
//       });

//     axios
//       .get(`${config.apiURL}/students/getSiblings`)
//       .then((res) => {
//         const { siblingsCount, siblingsData } = res.data;
//         setSiblingCount(siblingsCount);
//         setSiblingData(siblingsData);
//       })
//       .catch((error) => {
//         console.error('Error fetching siblings:', error);
//       });

//     axios
//       .get(`${config.apiURL}/students/present`)
//       .then((res) => {
//         setStudentPresent(res.data.present_count);
//       })
//       .catch((error) => {
//         console.error('Error fetching student present count:', error);
//       });

//     // axios.get(`${config.apiURL}/staffs/present`)
//     //   .then((res) => {
//     //     setStaffPresent(res.data.present_count);
//     //   })
//     //   .catch((error) => {
//     //     console.error('Error fetching staff present count:', error);
//     //   });
//   }, [selectedYear]);

//   const handleFeesClick = () => {
//     // Define actions for handleFeesClick
//   };

//   const handleTotalStudentClick = () => {
//     // Define actions for handleTotalStudentClick
//   };

//   const handleTotalStaffClick = () => {
//     // Define actions for handleTotalStaffClick
//   };

//   const handleRevenueClick = () => {
//     // Define actions for handleRevenueClick
//   };

//   const handleLogout = () => {
//     // Clear the token or any other authentication data
//     sessionStorage.removeItem('authToken'); // Adjust according to your token key
//     sessionStorage.clear();
//     navigate('/', { replace: true });
//     window.location.reload();
//   };

//   return (
//     <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
//       {/* <Button onClick={handleLogout} variant="contained" sx={styles.logoutButton}>
//         Logout
//       </Button> */}

//       <Grid container rowSpacing={4.5} columnSpacing={2.75} style={{ background: 'linear-gradient(to right, lightblue, pink)' }}>
//         <Grid item xs={12} sx={{ mb: -2.25 }}>
//           <Typography variant="h5">Dashboard</Typography>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3}>
//           <Link to="/addStudent" style={{ textDecoration: 'none' }}>
//             <Box
//               sx={{
//                 backgroundColor: '#5251AC',
//                 fontWeight: 'bold',
//                 height: '130px',
//                 width: '250px',
//                 borderRadius: '15px',
//                 padding: '10px',
//                 color: 'white',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#3f3b9e'
//                 }
//               }}
//               onClick={handleFeesClick}
//             >
//               <Typography variant="subtitle1" gutterBottom>
//                 New Admission
//               </Typography>
//               <Box display="flex" alignItems="center">
//                 <PiStudent style={{ height: '40px', width: '50px' }} />
//                 <Typography variant="h4" ml="auto">
//                   {studentsCount}
//                 </Typography>
//               </Box>
//               <Typography variant="body2">This Month</Typography>
//               <Typography variant="h6">0</Typography>
//             </Box>
//           </Link>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3}>
//           <Link to="/allstudentlist" style={{ textDecoration: 'none' }}>
//             <Box
//               sx={{
//                 backgroundColor: '#6789F5',
//                 fontWeight: 'bold',
//                 height: '130px',
//                 width: '250px',
//                 borderRadius: '15px',
//                 padding: '10px',
//                 color: 'white',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#5677e4'
//                 }
//               }}
//               onClick={handleTotalStudentClick}
//             >
//               <Typography variant="subtitle1" gutterBottom>
//                 Total Students
//               </Typography>
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <PiStudent style={{ height: '40px', width: '50px' }} />
//                 <Typography variant="h4" mx="10px">
//                   {studentsCount}
//                 </Typography>
//               </Box>
//             </Box>
//           </Link>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3}>
//           <Link to="/allstaffs" style={{ textDecoration: 'none' }}>
//             <Box
//               sx={{
//                 backgroundColor: '#9EA0D8',
//                 fontWeight: 'bold',
//                 height: '130px',
//                 width: '250px',
//                 borderRadius: '15px',
//                 padding: '10px',
//                 color: 'white',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#7f81c2'
//                 }
//               }}
//               onClick={handleTotalStaffClick}
//             >
//               <Typography variant="subtitle1" gutterBottom>
//                 Total Staffs
//               </Typography>
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <IoPeopleSharp style={{ height: '40px', width: '50px' }} />
//                 <Typography variant="h4" mx="10px">
//                   {staffsCount}
//                 </Typography>
//               </Box>
//             </Box>
//           </Link>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4} lg={3}>
//           <Link to="" style={{ textDecoration: 'none' }}>
//             <Box
//               sx={{
//                 backgroundColor: '#FA8892',
//                 fontWeight: 'bold',
//                 height: '130px',
//                 width: '250px',
//                 borderRadius: '15px',
//                 padding: '10px',
//                 color: 'white',
//                 cursor: 'pointer',
//                 '&:hover': {
//                   backgroundColor: '#f87580'
//                 }
//               }}
//               onClick={handleRevenueClick}
//             >
//               <Typography variant="subtitle1" gutterBottom>
//                 Total Revenue
//               </Typography>
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <RiMoneyRupeeCircleFill style={{ height: '40px', width: '50px' }} />
//                 <Typography variant="h4" mx="10px">
//                   {totalRevenue ? totalRevenue : 'Loading...'}
//                 </Typography>
//               </Box>
//             </Box>
//           </Link>
//         </Grid>

//         <Grid item xs={12} md={12} lg={12}>
//           <FeeCollectionChart />
//         </Grid>

//         {/* Add additional rows or cards here as needed */}
//       </Grid>
//     </Box>
//   );
// }




import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { PiStudent } from 'react-icons/pi';
import { IoPeopleSharp } from 'react-icons/io5';
import { RiMoneyRupeeCircleFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import FeeCollectionChart from './IncomeAreaChart';

const styles = {
  box: {
    fontWeight: 'bold',
    height: '130px',
    width: '100%',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.3s, background-color 0.3s',
    backgroundColor: '#6a5acd', // Soft purple
    color: 'white',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',

    }
  },
  link: {
    textDecoration: 'none'
  },
  icon: {
    height: '50px',
    width: '50px',
    color: 'white',
    marginBottom: '10px'
  },
  logoutButton: {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    top: '35px',
    right: '10px',
    zIndex: 1000
  },
  gridContainer: {
    padding: '20px',
    background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)',
    borderRadius: '10px'
  }
};

export default function SuperDashboardDefault() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [staffsCount, setStaffsCount] = useState(0);
  const [pendingstudent, setPendingstudent] = useState(0);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [studentPresent, setStudentPresent] = useState(0);
  const [staffPresent, setStaffPresent] = useState(0);
  const [siblingsCount, setSiblingCount] = useState(0);
  const [siblingsData, setSiblingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => setStaffsCount(res.data.length))
      .catch((error) => console.error('Error fetching staff:', error));

    axios
      .get(`${config.apiURL}/students/getStudentsCount`)
      .then((res) => setStudentsCount(res.data.total_count))
      .catch((error) => console.error('Error fetching student count:', error));

    // axios
    //   .get(`${config.apiURL}/students/getAllpendingStudents`)      
    //   .then((res) => {
    //   console.log(res.data)
    //   setTotalRevenue(res.data.total_count)})
    //   .catch((error) => console.error('Error fetching revenue:', error));

    axios
      .get(`${config.apiURL}/students/getAllpendingStudents`)
      .then((res) => {
        const totalPending = res.data.length || 0; // Fallback to 0 if total_count is not available
        setPendingstudent(totalPending);
      })
      .catch((error) => {
        console.error('Error fetching revenue:', error);
        setPendingstudent(0); // Fallback to 0 on error
      });


    axios
      .get(`${config.apiURL}/students/getSiblings`)
      .then((res) => {
        const { siblingsCount, siblingsData } = res.data;
        setSiblingCount(siblingsCount);
        setSiblingData(siblingsData);
      })
      .catch((error) => console.error('Error fetching siblings:', error));

    axios
      .get(`${config.apiURL}/students/present`)
      .then((res) => setStudentPresent(res.data.present_count))
      .catch((error) => console.error('Error fetching student present count:', error));
  }, [selectedYear]);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* <Button onClick={handleLogout} variant="contained" sx={styles.logoutButton}>
        Logout
      </Button> */}

      <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={styles.gridContainer}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Welcome to Your Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to="/addStudent" style={styles.link}>
            <Box sx={{ ...styles.box, backgroundColor: '#00796b' }}>
              <Typography variant="subtitle1">New Admission</Typography>
              <Box display="flex" alignItems="center">
                <PiStudent style={styles.icon} />
                <Typography variant="h5" sx={{ marginLeft: 'auto' }}>
                  {studentsCount}
                </Typography>
              </Box>
              <Typography variant="body2">This Month</Typography>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to="/allstudentlist" style={styles.link}>
            <Box sx={{ ...styles.box, backgroundColor: '#3f51b5' }}>
              <Typography variant="subtitle1">Total Students</Typography>
              <Box display="flex" alignItems="center">
                <PiStudent style={styles.icon} />
                <Typography variant="h5" sx={{ marginLeft: 'auto' }}>
                  {studentsCount}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to="/allstaffs" style={styles.link}>
            <Box sx={{ ...styles.box, backgroundColor: '#1e88e5' }}>
              <Typography variant="subtitle1">Total Staffs</Typography>
              <Box display="flex" alignItems="center">
                <IoPeopleSharp style={styles.icon} />
                <Typography variant="h5" sx={{ marginLeft: 'auto' }}>
                  {staffsCount}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Link to="" style={styles.link}>
            <Box sx={{ ...styles.box, backgroundColor: '#f44336' }}>
              <Typography variant="subtitle1">Total Fees Pending Student </Typography>
              <Box display="flex" alignItems="center">
              <IoPeopleSharp style={styles.icon} />
                <Typography variant="h5" sx={{ marginLeft: 'auto' }}>
                  {pendingstudent ? pendingstudent : 'Loading...'}
                </Typography>
              </Box>
            </Box>
          </Link>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <FeeCollectionChart />
        </Grid>
      </Grid>
    </Box>
  );
}