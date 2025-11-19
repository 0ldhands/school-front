

import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, MenuItem, TextField, CircularProgress, Dialog } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import config from '../../config';
import { Done } from '@mui/icons-material';

// Function to format date for display
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format for input type 'date'
};

function UpdateStudents({ data, onClose }) {
    const navigate = useNavigate();
    const [clsData, setClsData] = useState([]);
    const [studentInfo, setStudentInfo] = useState({
        stu_id: data ? data.stu_id : '',
        stu_name: data ? data.stu_name : '',
        aadhar_no: data ? data.aadhar_no : '',
        gender: data ? data.gender : '',
        dob: data ? formatDate(data.dob) : '',
        date_of_join: data ? formatDate(data.date_of_join) : '',
        cls_id: data ? data.cls_id : '',
        community: data ? data.community : '',
        father_name: data ? data.father_name : '',
        father_mobile: data ? data.father_mobile : '',
        mother_name: data ? data.mother_name : '',
        mother_mobile: data ? data.mother_mobile : '',
        bookingfees: data ? data.bookingfees : '',
        address: data ? data.address : '',
        Totalfees: data ? data.total_fees : ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleValidation = (name, value) => {
        let errmsg = "";
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;

        const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
        const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
        const validateDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

        // Validation for each field
        switch (name) {
            case "cls_id":
                if (!trimmedValue) errmsg = "Please select Class";
                break;
            case "stu_name":
                if (!trimmedValue) {
                    errmsg = "Please enter Student Name";
                } else if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
                    errmsg = "Student Name must contain only letters and spaces";
                }
                break;
            case "aadhar_no":
                if (trimmedValue && !validateAadhar(trimmedValue)) errmsg = "Please enter a valid 12-digit Aadhar number";
                break;
            case "gender":
                if (!trimmedValue) errmsg = "Please select Gender";
                break;
            case "dob":
                if (!validateDate(trimmedValue)) errmsg = "Please enter a valid Date of Birth";
                break;
            case "date_of_join":
                if (!validateDate(trimmedValue)) errmsg = "Please enter a valid Date of Joining";
                break;
            case "community":
                if (!trimmedValue) errmsg = "Please enter Community";
                break;
            case "father_name":
                if (!trimmedValue) {
                    errmsg = "Please enter Father Name";
                } else if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
                    errmsg = "Father Name must contain only letters and spaces";
                }
                break;
            case "father_mobile":
                if (!validatePhoneNumber(trimmedValue)) {
                    errmsg = "Please enter a valid mobile number";
                } else if (!/^\d{10}$/.test(trimmedValue)) {
                    errmsg = "Mobile number must be 10 digits";
                }
                break;
            case "mother_name":
                if (!trimmedValue) {
                    errmsg = "Please enter Mother Name";
                } else if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
                    errmsg = "Mother Name must contain only letters and spaces";
                }
                break;
            case "mother_mobile":
                if (!validatePhoneNumber(trimmedValue)) {
                    errmsg = "Please enter a valid mobile number";
                } else if (!/^\d{10}$/.test(trimmedValue)) {
                    errmsg = "Mobile number must be 10 digits";
                }
                break;
            case "address":
                if (!trimmedValue) errmsg = "Please enter Address";
                break;
            case "bookingfees":
                if (!trimmedValue) errmsg = "Please enter Booking Fees";
                break;
            case "Totalfees":
                if (!trimmedValue) errmsg = "Please enter Total Fees";
                break;
            default:
                break;
        }

        return errmsg;
    };

    useEffect(() => {
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching Class data", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);

        setErrors({ ...errors, [name]: error });
        setStudentInfo({ ...studentInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        // Validate form data
        let formErrors = {};
        Object.keys(studentInfo).forEach((name) => {
            const value = studentInfo[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setLoading(false);
            return;
        }

        // Submit form data
        axios.put(`${config.apiURL}/students/updateStudent/${data.stu_id}`, studentInfo)
            .then((res) => {
                if (res.status === 200) {
                    setSuccess(true);
                    alert("Update successful");
                    onClose();
                    // Reset form fields
                    setStudentInfo({
                        stu_id: "",
                        stu_name: "",
                        aadhar_no: "",
                        gender: "",
                        dob: "",
                        date_of_join: "",
                        cls_id: "",
                        community: "",
                        father_name: "",
                        father_mobile: "",
                        mother_name: "",
                        mother_mobile: "",
                        bookingfees: "",
                        address: "",
                        Totalfees: ""
                    });
                    setErrors({});
                    // navigate('/allStudents');
                } else {
                    console.error("Unexpected response status:", res.status);
                    setErrors({ general: "Update failed. Please try again." });
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                // Handle error response
                const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
                setErrors({ general: errorMsg });
                setLoading(false);
            });
    };

    return (
        <div>
            <h1>Update Student</h1>
            {loading && <CircularProgress />}
            {success && <div>Update submitted successfully!</div>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="cls_id"
                            label="Class"
                            onChange={handleChange}
                            value={studentInfo.cls_id}
                            error={!!errors.cls_id}
                            helperText={errors.cls_id}
                        >
                            {clsData.map((cls) => (
                                <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Student Name"
                            variant="outlined"
                            name="stu_name"
                            value={studentInfo.stu_name}
                            error={!!errors.stu_name}
                            helperText={errors.stu_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Aadhar Number"
                            type='number'
                            name="aadhar_no"
                            value={studentInfo.aadhar_no}
                            variant="outlined"
                            error={!!errors.aadhar_no}
                            helperText={errors.aadhar_no}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            InputLabelProps={{ shrink: true }}
                            type='date'
                            name='dob'
                            onChange={handleChange}
                            value={studentInfo.dob}
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Joining"
                            InputLabelProps={{ shrink: true }}
                            type='date'
                            name='date_of_join'
                            onChange={handleChange}
                            value={studentInfo.date_of_join}
                            error={!!errors.date_of_join}
                            helperText={errors.date_of_join}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="gender"
                            label="Gender"
                            onChange={handleChange}
                            value={studentInfo.gender}
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Community"
                            variant="outlined"
                            name="community"
                            value={studentInfo.community}
                            error={!!errors.community}
                            helperText={errors.community}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father's Name"
                            variant="outlined"
                            name="father_name"
                            value={studentInfo.father_name}
                            error={!!errors.father_name}
                            helperText={errors.father_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father's Mobile"
                            type='number'
                            name="father_mobile"
                            value={studentInfo.father_mobile}
                            error={!!errors.father_mobile}
                            helperText={errors.father_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother's Name"
                            variant="outlined"
                            name="mother_name"
                            value={studentInfo.mother_name}
                            error={!!errors.mother_name}
                            helperText={errors.mother_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother's Mobile"
                            type='number'
                            name="mother_mobile"
                            value={studentInfo.mother_mobile}
                            error={!!errors.mother_mobile}
                            helperText={errors.mother_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Booking Fees"
                            type='number'
                            name="bookingfees"
                            value={studentInfo.bookingfees}
                            error={!!errors.bookingfees}
                            helperText={errors.bookingfees}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Total Fees"
                            type='number'
                            name="Totalfees"
                            value={studentInfo.Totalfees}
                            error={!!errors.Totalfees}
                            helperText={errors.Totalfees}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={studentInfo.address}
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Update
                    </Button>
                    <Button onClick={onClose} variant="outlined" color="secondary" style={{ marginLeft: 10 }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </div>
    );
}

export default UpdateStudents;
