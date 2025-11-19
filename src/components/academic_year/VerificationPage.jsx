// VerificationPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VerificationPage = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPin(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (pin === '2025') {
      navigate('/academic'); 
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Verify Your Identity
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <TextField
          label="Enter 4-Digit PIN"
          variant="outlined"
          type="password"
          value={pin}
          onChange={handleChange}
          inputProps={{ maxLength: 4 }}
          required
          fullWidth
          style={{ marginBottom: 20 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Verify
        </Button>
      </form>
    </Container>
  );
};

export default VerificationPage;