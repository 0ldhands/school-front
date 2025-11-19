
import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, MenuItem, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import config from '../../config';
import { Done } from '@mui/icons-material';

function StudentEnquiryApplication({ onClose }) {
    const navigate = useNavigate();
    const [clsData, setClsData] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        cls_id: "",
        stu_name: "",
        stu_aadhar: "" || null,
        gender: "",
        dob: "",
        community: "",
        father_name: "",
        father_mobile: "",
        mother_name: "",
        mother_mobile: "",
        address: "",
        enquiry_date: ""
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
            case "stu_aadhar":
                if (trimmedValue && !validateAadhar(trimmedValue)) errmsg = "Please enter a valid 12-digit Aadhar number";
                break;
            case "gender":
                if (!trimmedValue) errmsg = "Please select Gender";
                break;
            case "dob":
                if (!validateDate(trimmedValue)) errmsg = "Please enter a valid Date of Birth";
                break;
            // case "community":
            //     if (!trimmedValue) errmsg = "Please enter Community";
            //     break;
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
        setStudentinfo({ ...studentinfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        
        let formErrors = {};
        Object.keys(studentinfo).forEach((name) => {
            const value = studentinfo[name];
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

        axios.post(`${config.apiURL}/students/enquirystudents`, studentinfo)
            .then((res) => {
                navigate(-1)
                console.log("Success", res);
             
                onClose();
                setStudentinfo({
                    cls_id: "",
                    stu_name: "",
                    stu_aadhar: "",
                    gender: "",
                    dob: "",
                    community: "",
                    father_name: "",
                    father_mobile: "",
                    mother_name: "",
                    mother_mobile: "",
                    address: "",
                    enquiry_date: ""
                });
                setErrors({});
                setLoading(false);
                navigate('/allStudents');  // Navigate to the allStudents page after successful submission
            })
            .catch((err) => {
                console.log("Error:", err);
                setLoading(false);
            });
            onClose()
    };

    return (
        <div>
            <h1>Student Enquiry Form</h1>
            {loading }
            {success && <div>Form submitted successfully!</div>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="cls_id"
                            label="Class"
                            onChange={handleChange}
                            value={studentinfo.cls_id}
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
                            value={studentinfo.stu_name}
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
                            name="stu_aadhar"
                            value={studentinfo.stu_aadhar}
                            variant="outlined"
                            error={!!errors.stu_aadhar}
                            helperText={errors.stu_aadhar}
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
                            value={studentinfo.dob}
                            variant="outlined"
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="gender"
                            label="Gender"
                            onChange={handleChange}
                            value={studentinfo.gender}
                            variant="outlined"
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Community"
                            name="community"
                            value={studentinfo.community}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.community}
                            helperText={errors.community}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Father Name"
                            onChange={handleChange}
                            name="father_name"
                            value={studentinfo.father_name}
                            variant="outlined"
                            error={!!errors.father_name}
                            helperText={errors.father_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Mobile"
                            type='number'
                            name="father_mobile"
                            value={studentinfo.father_mobile}
                            variant="outlined"
                            error={!!errors.father_mobile}
                            helperText={errors.father_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Name"
                            name="mother_name"
                            value={studentinfo.mother_name}
                            variant="outlined"
                            error={!!errors.mother_name}
                            helperText={errors.mother_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Mother Mobile"
                            type='number'
                            name="mother_mobile"
                            value={studentinfo.mother_mobile}
                            variant="outlined"
                            error={!!errors.mother_mobile}
                            helperText={errors.mother_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date of Enquiry"
                                InputLabelProps={{ shrink: true }}
                                type="date"
                                name="enquiry_date"
                                onChange={handleChange}
                                value={studentinfo.enquiry_date}
                                variant="outlined"
                                error={!!errors.enquiry_date}
                                helperText={errors.enquiry_date}
                            />
                        </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Address"
                            name="address"
                            value={studentinfo.address}
                            variant="outlined"
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>

                </Grid>
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Submit"} <Done />
                    </Button>
                    <Button onClick={onClose} variant="outlined" color="secondary" style={{ marginLeft: 10 }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </div>
    );
}

export default StudentEnquiryApplication;
