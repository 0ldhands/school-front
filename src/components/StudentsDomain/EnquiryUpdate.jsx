import React, { useEffect, useState } from 'react';
import { Grid, MenuItem, Select, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { Done } from '@mui/icons-material';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

function UpdateEnquiryStudent({ data, onClose }) {
    const [clsData, setClsData] = useState([]);
    const [studentInfo, setStudentInfo] = useState({
        id: data ? data.id : '',
        student_name: data ? data.student_name : '',
        aadhar_no: data ? data.aadhar_no : '',
        gender: data ? data.gender : '',
        date_of_birth: data ? data.date_of_birth : '',
        class: data ? data.class : '',
        community: data ? data.community : '',
        father_name: data ? data.father_name : '',
        father_mobile: data ? data.father_mobile : '',
        mother_name: data ? data.mother_name : '',
        mother_mobile: data ? data.mother_mobile : '',
        address: data ? data.address : '',
    });

    const [errors, setErrors] = useState({});

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
        setStudentInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the date_of_birth to 'YYYY-MM-DD'
        const formattedDate = new Date(studentInfo.date_of_birth).toISOString().split('T')[0];

        // Create a new object to send, replacing date_of_birth with the formatted date
        const updatedStudentInfo = { ...studentInfo, date_of_birth: formattedDate };

        // Add validation logic here if necessary
        axios.put(`${config.apiURL}/students/updateEnquiryStudent/${data.id}`, updatedStudentInfo)
            .then((res) => {
                console.log("Update successful", res.data);
                onClose();  // Close the dialog after successful update
            })
            .catch((err) => {
                console.log("Error updating student data:", err);
            });
    };

    return (
        <div>
            <h1>Update Student</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Student Name"
                            variant="outlined"
                            name="student_name"
                            value={studentInfo.student_name}
                            error={!!errors.student_name}
                            helperText={errors.student_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Aadhar Number"
                            type="number"
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
                            type="date"
                            name="date_of_birth"
                            onChange={handleChange}
                            value={studentInfo.date_of_birth}
                            variant="outlined"
                            error={!!errors.date_of_birth}
                            helperText={errors.date_of_birth}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            labelId="class-select-label"
                            id="class-select"
                            value={studentInfo.class}
                            onChange={handleChange}
                            name="class"
                            label="Class"
                            fullWidth
                            error={!!errors.class}
                            helperText={errors.class}
                        >
                            {clsData.map((cls) => (
                                <MenuItem key={cls.cls_id} value={cls.cls_id}>
                                    {cls.cls_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={studentInfo.gender}
                            onChange={handleChange}
                            name="gender"
                            label="Gender"
                            fullWidth
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Community"
                            name="community"
                            value={studentInfo.community}
                            variant="outlined"
                            error={!!errors.community}
                            helperText={errors.community}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Father Name"
                            name="father_name"
                            value={studentInfo.father_name}
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
                            name="father_mobile"
                            value={studentInfo.father_mobile}
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
                            value={studentInfo.mother_name}
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
                            name="mother_mobile"
                            value={studentInfo.mother_mobile}
                            variant="outlined"
                            error={!!errors.mother_mobile}
                            helperText={errors.mother_mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Address"
                            name="address"
                            value={studentInfo.address}
                            variant="outlined"
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button type="submit" variant="contained" startIcon={<Done />} color="success">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default UpdateEnquiryStudent;
