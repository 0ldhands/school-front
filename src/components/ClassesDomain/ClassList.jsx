// // ClassList.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import config from '../../config';
// import { Grid, Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';
// import { styled } from '@mui/system';
// import { Link } from 'react-router-dom';

// const Root = styled('div')(({ theme }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   backgroundColor: theme.palette.background.default,
//   minHeight: '100vh'
// }));

// const StyledCard = styled(Card)(({ theme }) => ({
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'space-between',
//   transition: 'transform 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'scale(1.05)'
//   }
// }));

// const CardContentCentered = styled(CardContent)({
//   flexGrow: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: '16px'
// });

// const Title = styled(Typography)(({ theme }) => ({
//   fontSize: '1.5rem',
//   fontWeight: 'bold',
//   color: theme.palette.text.primary,
//   marginBottom: theme.spacing(2)
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: theme.palette.primary.dark
//   }
// }));

// const PlaceholderImage = styled('div')({
//   width: '100%',
//   height: 140,
//   backgroundColor: '#e0e0e0'
// });
// function ClassList() {
//     const [classesData, setClassesData] = useState([]);
  
//     useEffect(() => {
//       axios
//         .get(`${config.apiURL}/clsAndSec/getclass`)
//         .then((res) => {
//           setClassesData(res.data);
//         })
//         .catch((err) => {
//           console.log('Error fetching classes:', err);
//         });
//     }, []);
  
//     return (
//       <Root>
//         <Grid container spacing={4}>
//           {classesData.map((cls) => (
//             <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
//               <StyledCard>
               
//                 <CardContentCentered>
//                   <Title>{cls.cls_name}</Title>
//                 </CardContentCentered>
//                 <CardActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
//                   <Link to={`/viewStudents/${cls.cls_id}`}>
//                     <StyledButton size="small">View Student Details</StyledButton>
//                   </Link>
//                 </CardActions>
//               </StyledCard>
//             </Grid>
//           ))}
//         </Grid>
//       </Root>
//     );
//   }
  

// export default ClassList;
// ClassList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { Grid, Card, CardContent, Typography, CardActions, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';

const Root = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '260px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  overflow: 'hidden',
  position: 'relative',
  background: 'linear-gradient(to bottom right, #f3e5f5, #ce93d8)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
    background: 'linear-gradient(to bottom right, #ce93d8, #f3e5f5)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '50%',
    width: '160%',
    height: '160%',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -120%) scale(0)',
    transition: 'transform 0.5s ease',
  },
  '&:hover::before': {
    transform: 'translate(-50%, -120%) scale(1)',
  },
}));

const CardContentCentered = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(1, 4),
  textTransform: 'capitalize',
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function ClassList() {
  const [classesData, setClassesData] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClassesData(res.data);
      })
      .catch((err) => {
        console.log('Error fetching classes:', err);
      });
  }, []);

  return (
    <Root>
      <Typography variant="h4" align="center" gutterBottom>
        Available Classes
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Select a class to view student details
      </Typography>
      <Grid container spacing={4}>
        {classesData.map((cls, index) => (
          <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
            <Fade cascade damping={0.1} delay={index * 100}>
              <StyledCard>
                <CardContentCentered>
                  <Title>{cls.cls_name}</Title>
                  <SubText>Explore Class Details</SubText>
                </CardContentCentered>
                <CardActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                  <Link to={`/viewStudents/${cls.cls_id}`} style={{ textDecoration: 'none' }}>
                    <StyledButton>View Students</StyledButton>
                  </Link>
                </CardActions>
              </StyledCard>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}

export default ClassList;
