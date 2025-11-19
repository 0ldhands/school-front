import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const AuthLogin = ({ isDemo = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [staffData, setStaffData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.apiURL}/staffs/getStaffs`)
      .then((res) => setStaffData(res.data))
      .catch((err) => console.log("Error Staff Data fetching", err));
  }, []);

  const handleLogin = async (values) => {
    const { email, mobile } = values;

    // Check if the entered credentials match admin or superadmin credentials
    const isAdmin = email === 'dreampublicschool@gmail.com' && mobile === '7708777736';
    const isSuperAdmin = email === 'super@gmail.com' && mobile === '1234567890';

    if (isAdmin || isSuperAdmin) {
      sessionStorage.setItem(isAdmin ? 'admin' : 'super', true);
      navigate('/');
      window.location.reload();
      return;
    }

    // If not admin/superadmin, check staff credentials
    const user = staffData.find(user => user.email === email && user.mobile === mobile);

    if (user) {
      sessionStorage.setItem('employeeLoggedIn', true);
      sessionStorage.setItem('dept_id', user.dept_id);
      sessionStorage.setItem('dept_name', user.dept_name);
      sessionStorage.setItem('role_id', user.role_id);
      sessionStorage.setItem('role_name', user.role_name);
      sessionStorage.setItem('staff_id', user.staff_id);
      navigate('/');
      window.location.reload();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          mobile: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          mobile: Yup.string().max(15).required('Mobile number is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleLogin(values).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="mobile-login">Mobile Number</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.mobile && errors.mobile)}
                    id="mobile-login"
                    type="tel"
                    value={values.mobile}
                    name="mobile"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </Stack>
                {touched.mobile && errors.mobile && (
                  <FormHelperText error id="standard-weight-helper-text-mobile-login">
                    {errors.mobile}
                  </FormHelperText>
                )}
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <FormHelperText error>{error}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider>
                  {/* <Typography variant="caption"> Login with</Typography> */}
                </Divider>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

AuthLogin.propTypes = { isDemo: PropTypes.bool };

export default AuthLogin;
