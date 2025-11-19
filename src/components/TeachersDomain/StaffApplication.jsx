import React, { useEffect, useState } from 'react';
import { Grid, TextField, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

function StaffApplication() {
    const navigate = useNavigate();
    const [deptInfo, setDeptInfo] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [staffInfo, setStaffInfo] = useState({
        dept_id: "",
        role_id: "",
        staff_name: "",
        email: "",
        mobile: "",
        gender: "",
        qualification: "",
        experience: "",
        address: "",
        staff_img: null
    });
    const [errorStaffInfo, setErrorStaffInfo] = useState({
        dept_id: "",
        role_id: "",
        staff_name: "",
        email: "",
        mobile: "",
        gender: "",
        qualification: "",
        experience: "",
        address: "",
        staff_img: null
    });
    
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Validation functions
    const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
    const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
    const validateAnnualIncome = (income) => /^\d+(\.\d{1,2})?$/.test(income);
    const validateDate = (date) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        return datePattern.test(date);
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleValidation = (name, value) => {
        let errmsg = "";
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;

        switch (name) {
            case "dept_id":
                if (!trimmedValue) errmsg = "Please fill the department name";
                break;
            case "role_id":
                if (!trimmedValue) errmsg = "Please fill the role name";
                break;
            case "staff_name":
                if (!trimmedValue) errmsg = "Please fill the staff name";
                break;
            case "email":
                if (!validateEmail(trimmedValue)) errmsg = "Please fill the email";
                break;
            case "mobile":
                if (!validatePhoneNumber(trimmedValue)) errmsg = "Please enter a valid mobile number";
                break;
            case "gender":
                if (!trimmedValue) errmsg = "Please select gender";
                break;
            case "qualification":
                if (!trimmedValue) errmsg = "Please fill the qualification";
                break;
            case "experience":
                if (!trimmedValue) errmsg = "Please fill the experience";
                break;
            case "address":
                if (!trimmedValue) errmsg = "Please fill the address";
                break;
            default:
                break;
        }

        return errmsg;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        const error = handleValidation(name, newValue);
        setErrorStaffInfo({ ...errorStaffInfo, [name]: error });
        setStaffInfo({ ...staffInfo, [name]: newValue });
    };

    useEffect(() => {
        axios.get(`${config.apiURL}/department/getDept`)
            .then((res) => {
                setDeptInfo(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
            });
    }, []);

    useEffect(() => {
        if (staffInfo.dept_id) {
            axios.get(`${config.apiURL}/role/getRoleByDept?dept_id=${staffInfo.dept_id}`)
                .then((res) => {
                    setRoleData(res.data);
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
        }
    }, [staffInfo.dept_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let allerrors = {};
        Object.keys(staffInfo).forEach((name) => {
            const value = staffInfo[name];
            const error = handleValidation(name, value);
            if (error) {
                allerrors[name] = error;
            }
        });
        if (Object.keys(allerrors).length > 0) {
            setErrorStaffInfo(allerrors);
            setSnackbarMessage("Please fill all the required fields correctly.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(staffInfo).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        axios
            .post(`${config.apiURL}/staffs/saveStaff`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                console.log("Success", res);
                console.log("Data", staffInfo);
                setSnackbarMessage("Staff application submitted successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setStaffInfo({
                    dept_id: "",
                    role_id: "",
                    staff_name: "",
                    email: "",
                    mobile: "",
                    gender: "",
                    qualification: "",
                    experience: "",
                    address: "",
                    staff_img: null
                });
                setErrorStaffInfo({});
            })
            .catch((err) => {
                console.log("Error:", err);
                setSnackbarMessage("An error occurred while submitting the application.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <h1>Staff Application Form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Department"
                            variant="outlined"
                            name="dept_id"
                            onChange={handleChange}
                            error={!!errorStaffInfo.dept_id}
                            helperText={errorStaffInfo.dept_id}
                            value={staffInfo.dept_id}
                        >
                            {deptInfo.map((dept) => (
                                <MenuItem key={dept.dept_id} value={dept.dept_id}>
                                    {dept.dept_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            variant="outlined"
                            name="role_id"
                            onChange={handleChange}
                            error={!!errorStaffInfo.role_id}
                            helperText={errorStaffInfo.role_id}
                            value={staffInfo.role_id}
                        >
                            {roleData.map((role) => (
                                <MenuItem key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Staff Name"
                            variant="outlined"
                            name="staff_name"
                            error={!!errorStaffInfo.staff_name}
                            helperText={errorStaffInfo.staff_name}
                            value={staffInfo.staff_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Email"
                            variant="outlined"
                            name="email"
                            error={!!errorStaffInfo.email}
                            helperText={errorStaffInfo.email}
                            value={staffInfo.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mobile"
                            variant="outlined"
                            name="mobile"
                            error={!!errorStaffInfo.mobile}
                            helperText={errorStaffInfo.mobile}
                            value={staffInfo.mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Gender"
                            variant="outlined"
                            name="gender"
                            onChange={handleChange}
                            error={!!errorStaffInfo.gender}
                            helperText={errorStaffInfo.gender}
                            value={staffInfo.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Qualification"
                            variant="outlined"
                            name="qualification"
                            error={!!errorStaffInfo.qualification}
                            helperText={errorStaffInfo.qualification}
                            value={staffInfo.qualification}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Experience"
                            variant="outlined"
                            name="experience"
                            error={!!errorStaffInfo.experience}
                            helperText={errorStaffInfo.experience}
                            value={staffInfo.experience}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Address"
                            variant="outlined"
                            name="address"
                            error={!!errorStaffInfo.address}
                            helperText={errorStaffInfo.address}
                            value={staffInfo.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            type="file"
                            label="Staff Image"
                            variant="outlined"
                            name="staff_img"
                            InputLabelProps={{ shrink: true }}
                            error={!!errorStaffInfo.staff_img}
                            helperText={errorStaffInfo.staff_img}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" style={{ backgroundColor: '#4CAF50' }}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Snackbar for displaying messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default StaffApplication;
