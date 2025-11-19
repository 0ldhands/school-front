import styled from '@emotion/styled';
import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const StyledLink = styled(Link)({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});

const GradientButton = styled(Button)({
  background: '#149cc8',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '15px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: ' #FF4081 ',
  },
});

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  // minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

const Header = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1677ff',
  marginBottom: '20px',
});

function Allfeesalloc() {
  return (
    <Container>
      <Header>Pay Fees</Header>
      <StyledLink to="/feesallocationmanu">
        <GradientButton>Class</GradientButton>
      </StyledLink>
      <StyledLink to="/feesstudent">
        <GradientButton>Students</GradientButton>
      </StyledLink>
    </Container>
  );
}

export default Allfeesalloc;
