import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, MenuItem, TextField, CircularProgress, } from '@mui/material';
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

function StudentAdmissionApplication({ data, onClose }) {
    const navigate = useNavigate();
    const [clsData, setClsData] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        stu_id: data ? data.id : "",
        cls_id: data ? data.class : '',
        stu_name: data ? data.student_name : '',
        stu_aadhar: data ? data.aadhar_no : '',
        gender: data ? data.gender : '',
        dob: data ? formatDate(data.dob) : '',
        doj: data ? formatDate(data.date_of_join) : '',
        community: data ? data.community : '',
        father_name: data ? data.father_name : '',
        father_mobile: data ? data.father_mobile : '',
        mother_name: data ? data.mother_name : '',
        mother_mobile: data ? data.mother_mobile : '',
        Bookingfees: data ? data.bookingfees : '',
        address: data ? data.address : '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    console.log(studentinfo);

    const handleValidation = (name, value) => {
        let errmsg = "";
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;

        const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
        const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);
        const validateDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
        const validateNumber = (num) => /^\d+$/.test(num);
        const validateYear = (year) => /^\d{9}$/.test(year); // 9-digit year validation



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
                if (trimmedValue && !validateAadhar(trimmedValue)) {
                    errmsg = "Please enter a valid 12-digit Aadhar number";
                }
                break;
            case "gender":
                if (!trimmedValue) errmsg = "Please select Gender";
                break;
            case "dob":
                if (!validateDate(trimmedValue)) errmsg = "Please enter a valid Date of Birth";
                break;
            case "doj":
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
            case "Bookingfees":
                if (!trimmedValue) {
                    errmsg = "Please enter Booking Fees";
                } else if (!validateNumber(trimmedValue)) {
                    errmsg = "Booking Fees must be a valid number";
                }
                break;
            // case "totalfees":
            //     if (!trimmedValue) {
            //         errmsg = "Please enter Total Fees";
            //     } else if (!validateNumber(trimmedValue)) {
            //         errmsg = "Total Fees must be a valid number";
            //     }
            //     break;
            case "academic_year":
                if (!trimmedValue) {
                    errmsg = "Please enter an Academic Year";  // Error for empty academic year
                } else {
                    // Validate that the year is either in YYYY or YYYY-YYYY format
                    const regex = /^\d{4}(-\d{4})?$/;  // Matches "2024" or "2024-2025"
                    if (!regex.test(trimmedValue)) {
                        errmsg = "Please enter a valid academic year in the format YYYY or YYYY-YYYY";
                    } else if (trimmedValue.includes("-")) {
                        const parts = trimmedValue.split("-");
                        const currentYear = parseInt(parts[0], 10);
                        const nextYear = parseInt(parts[1], 10);
    
                        // Validate that the second year is exactly one year after the first year
                        if (nextYear !== currentYear + 1) {
                            errmsg = "The next year should be exactly one year after the current year.";
                        }
                    }
                }
                break;


            default:
                break;
        }

        return errmsg;
    };

    useEffect(() => {
        fetch(`${config.apiURL}/clsAndSec/getClass`)
            .then((response) => response.json())
            .then((data) => setClsData(data))
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

    // const handleAcademicYearChange = (e) => {
    //     const { value } = e.target;

    //     // If the value is a valid year, generate the academic year range (e.g., 2002 -> 2002-2003)
    //     const year = parseInt(value, 10);
    //     if (year && !isNaN(year)) {
    //         const nextYear = year + 1;
    //         const academicYearRange = `${year}-${nextYear}`;
    //         setStudentinfo({ ...studentinfo, academic_year: academicYearRange });
    //     } else {
    //         setStudentinfo({ ...studentinfo, academic_year: value });
    //     }
    // };
    const handleAcademicYearChange = (e) => {
        const { value } = e.target;

        // If the value is empty (i.e., user deletes the input), reset the academic_year to an empty string
        if (value === "") {
            setStudentinfo({
                ...studentinfo,
                academic_year: ""  // Reset the academic_year when the input is empty
            });
            return;
        }

        // If the value contains a dash and the second part (next year) is deleted, remove the dash
        if (value.includes("-")) {
            const parts = value.split("-");
            if (parts[1]?.length === 0) {
                // Remove the dash if the next part is empty
                setStudentinfo({
                    ...studentinfo,
                    academic_year: parts[0] // Only keep the first part (year)
                });
                return;
            }
        }

        // Validate the input to ensure it's a 4-digit number
        const year = parseInt(value, 10);

        if (year && !isNaN(year) && value.length === 4) {
            const nextYear = year + 1;
            setStudentinfo({
                ...studentinfo,
                academic_year: `${year}-${nextYear}` // Format: 2024-2025
            });
        } else {
            setStudentinfo({ ...studentinfo, academic_year: value });
        }
    };







    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        // Validate form data
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

        try {
            const response = await fetch(`${config.apiURL}/students/addstudents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentinfo) // Include the academic_year here
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (response.status) {
                console.log("Success", data);
                setSuccess(true);
                alert("Success");
                onClose();

                // Reset form
                setStudentinfo({
                    cls_id: "",
                    stu_name: "",
                    stu_aadhar: "",
                    gender: "",
                    dob: "",
                    doj: "",
                    community: "",
                    father_name: "",
                    father_mobile: "",
                    mother_name: "",
                    mother_mobile: "",
                    Bookingfees: "",
                    address: "",
                    academic_year: "" // Reset the academic year as well
                });
                setErrors({});
                navigate('/StudentsBooking')
            } else {
                console.error("Unexpected response status:", response.status);
                setErrors({ general: "Submission failed. Please try again." });
            }
        } catch (err) {
            console.error("Error:", err);
            // Handle error response
            const errorMsg = err.message || "An error occurred. Please try again.";
            setErrors({ general: errorMsg });
        } finally {
            setLoading(false);
        }
        onClose();
    };


    return (
        <div>
            <h1>Student Admission Form</h1>
            {loading}
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
                            type='text'
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
                            name='doj'
                            onChange={handleChange}
                            value={studentinfo.doj}
                            error={!!errors.doj}
                            helperText={errors.doj}
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
                            value={studentinfo.community}
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
                            value={studentinfo.father_name}
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
                            value={studentinfo.father_mobile}
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
                            value={studentinfo.mother_name}
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
                            value={studentinfo.mother_mobile}
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
                            name="Bookingfees"
                            value={studentinfo.Bookingfees}
                            error={!!errors.Bookingfees}
                            helperText={errors.Bookingfees}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Total Fees"
                            type='number'
                            name="totalfees"
                            value={studentinfo.totalfees}
                            error={!!errors.totalfees}
                            helperText={errors.totalfees}
                        />
                    </Grid> */}
                    {/* <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    onChange={handleAcademicYearChange} // Use the new handler here
                                    label="Academic Year"
                                    variant="outlined"
                                    name="academic_year"
                                    value={studentinfo.academic_year || ""}
                                    error={!!errors.academic_year}
                                    helperText={errors.academic_year}
                                />
                            </Grid> */}
                    <Grid item xs={12} sm={6}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                onChange={handleAcademicYearChange} // Use the new handler here
                                label="Academic Year"
                                variant="outlined"
                                name="academic_year"
                                value={studentinfo.academic_year || ""}
                                error={!!errors.academic_year}
                                helperText={errors.academic_year}
                                required
                            />
                        </Grid>

                    </Grid>



                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Address"
                            variant="outlined"
                            name="address"
                            value={studentinfo.address}
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>
                </Grid>
                {errors.general && (
                    <Box mt={2}>
                        <div style={{ color: 'red' }}>{errors.general}</div>
                    </Box>
                )}
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? onClose() : "Submit"} <Done />
                    </Button>
                    <Button onClick={onClose} variant="outlined" color="secondary" style={{ marginLeft: 10 }}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </div>
    );
}

export default StudentAdmissionApplication;