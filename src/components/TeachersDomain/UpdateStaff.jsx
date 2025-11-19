import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { Done } from '@mui/icons-material';

function UpdateStaff({ data, onClose }) {
    const [staffInfo, setStaffInfo] = useState({
        staff_id: data ? data.staff_id : "",
        dept_id: data ? data.dept_id : "",
        role_id: data ? data.role_id : "",
        staff_name: data ? data.staff_name : "",
        email: data ? data.email : "",
        mobile: data ? data.mobile : "",
        gender: data ? data.gender : "",
        qualification: data ? data.qualification : "",
        experience: data ? data.experience : "",
        address: data ? data.address : "",
        staff_img: data ? data.staff_img : null
    });

    const [deptData, setDeptData] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [errors, setErrors] = useState({
        staff_id: '',
        dept_id: '',
        role_id: '',
        staff_name: '',
        email: '',
        mobile: '',
        gender: '',
        qualification: '',
        experience: '',
        address: '',
        staff_img:'',
    });

    useEffect(() => {
        axios.get(`${config.apiURL}/department/getDept`)
            .then((res) => {
                setDeptData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching department data:", err);
            });

        axios.get(`${config.apiURL}/role/getRoleByDept?dept_id=${staffInfo.dept_id}`)
            .then((res) => {
                setRoleData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching role data:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        const error = handleValidation(name, newValue);
        setErrors({ ...errors, [name]: error });
        setStaffInfo({ ...staffInfo, [name]: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        Object.keys(staffInfo).forEach((name) => {
            const value = staffInfo[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formData = new FormData();

        Object.entries(staffInfo).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value, value.name);
            } else {
                formData.append(key, value);
            }
        });

        axios.put(`${config.apiURL}/staffs/updateStaff/${data.staff_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then((res) => {
            console.log("Success");
            onClose();
        })
        .catch((err) => {
            console.log("Error:", err);
        });
    };

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;
        let errorMessage = '';

        switch (name) {
            case 'staff_id':
                if (!trimmedValue) errorMessage = 'Please select Staff Name';
                break;
            case 'dept_id':
                if (!trimmedValue) errorMessage = 'Please select Department';
                break;
            case 'role_id':
                if (!trimmedValue) errorMessage = 'Please select Role';
                break;
            case 'staff_name':
                if (!trimmedValue) errorMessage = 'Please enter Staff Name';
                break;
            case 'email':
                if (!trimmedValue) errorMessage = 'Please enter Email';
                break;
            case 'mobile':
                if (!trimmedValue) errorMessage = 'Please enter Mobile';
                break;
            case 'gender':
                if (!trimmedValue) errorMessage = 'Please select Gender';
                break;
            case 'qualification':
                if (!trimmedValue) errorMessage = 'Please enter Qualification';
                break;
            case 'experience':
                if (!trimmedValue) errorMessage = 'Please enter Experience';
                break;
            case 'address':
                if (!trimmedValue) errorMessage = 'Please enter Address';
                break;
            case 'staff_img':
                if (!value) errorMessage = 'Please upload Staff Image';
                break;
            default:
                break;
        }

        return errorMessage;
    };

    return (
        <div>
            <h1>Staff Update Form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            select 
                            label="Department" 
                            name="dept_id" 
                            value={staffInfo.dept_id} 
                            onChange={handleChange} 
                            variant="outlined"
                            error={!!errors.dept_id}
                            helperText={errors.dept_id}
                        >
                            {deptData.map((dept) => (
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
                            name="role_id" 
                            value={staffInfo.role_id} 
                            onChange={handleChange} 
                            variant="outlined"
                            error={!!errors.role_id}
                            helperText={errors.role_id}
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
                            value={staffInfo.staff_name} 
                            error={!!errors.staff_name}
                            helperText={errors.staff_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            onChange={handleChange} 
                            label="Email" 
                            variant="outlined" 
                            name="email" 
                            value={staffInfo.email} 
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            onChange={handleChange} 
                            label="Mobile" 
                            variant="outlined" 
                            name="mobile" 
                            value={staffInfo.mobile} 
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            select 
                            label="Gender" 
                            name="gender" 
                            value={staffInfo.gender} 
                            onChange={handleChange} 
                            variant="outlined"
                            error={!!errors.gender}
                            helperText={errors.gender}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="others">Others</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            onChange={handleChange} 
                            label="Qualification" 
                            variant="outlined" 
                            name="qualification" 
                            value={staffInfo.qualification} 
                            error={!!errors.qualification}
                            helperText={errors.qualification}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            onChange={handleChange} 
                            label="Experience" 
                            variant="outlined" 
                            name="experience" 
                            value={staffInfo.experience} 
                            error={!!errors.experience}
                            helperText={errors.experience}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth 
                            onChange={handleChange} 
                            label="Address" 
                            variant="outlined" 
                            name="address" 
                            value={staffInfo.address} 
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                          </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            type="file"
                            label="Staff image"
                            name="staff_img"
                            accept="image/*"
                            variant="outlined"
                            error={!!errors.staff_img}
                            helperText={errors.staff_img}
                        />
                    </Grid>
                  
                    <Grid item xs={12} sm={6}>
                        <Button variant='contained' color='success' startIcon={<Done/>} type="submit">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default UpdateStaff;
