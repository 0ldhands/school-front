import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../../config';
import { Box, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function Feesallocstudent() {
  const [classes, setClasses] = useState([]); // Initialize with an empty array

  useEffect(() => {
    axios.get(`${config.apiURL}/clsAndSec/getclass`)
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        console.log("Error fetching class data", err);
      });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily: 'Roboto, sans-serif',
          color: '#333',
        }}
      >
        Select a Class for Fee Allocation
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {classes.map((cls) => (
          <Grid item xs={12} sm={6} md={4} key={cls.cls_id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 2,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: '500',
                    textAlign: 'center',
                    color: '#333',
                  }}
                >
                  {cls.cls_name}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'center' }}>
                <Link to={`/feespage/${cls.cls_id}`} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    View Fees
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Feesallocstudent;
