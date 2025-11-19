import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import config from '../../config'
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Done } from '@mui/icons-material';

const UpdateStaffAllocation = ({ data, onClose }) => {
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [subData, setSubData] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const [formData, setFormData] = useState({
        staff_id: data ? data.staff_id : "",
        cls_id: data ? data.cls_id : "",
        cls_allocation_id: data ? data.cls_allocation_id : "",
        sub_id: data ? data.sub_id : "",
        academic_year: data ? data.academic_year : "",
    });
    const navigate = useNavigate();
    const previousClsIdRef = useRef();
    const previousClsAllocationIdRef = useRef();

    useEffect(() => {
        axios.get(`${config.apiURL}/staffs/getStaffs`)
            .then((res) => {
                setStaffData(res.data)
            })
            .catch((err) => {
                console.log('The error is :', err);
            })
    }, [])

    useEffect(() => {
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data)
            })
            .catch((err) => {
                console.log('The error is :', err);
            })
    }, [])

    useEffect(() => {
        if (formData.cls_id) {
            axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${formData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                    // Clear cls_allocation_id and sub_id only when cls_id changes
                    if (previousClsIdRef.current !== formData.cls_id) {
                        setFormData(prevState => ({ ...prevState, cls_allocation_id: "", sub_id: "" }));
                    }
                })
                .catch((err) => {
                    console.log('The error is :', err);
                });
        }
        // Update the previousClsIdRef with the current cls_id
        previousClsIdRef.current = formData.cls_id;
    }, [formData.cls_id]);

    useEffect(() => {
        if (formData.cls_allocation_id) {
            axios.get(`${config.apiURL}/subject/getSubjects/${formData.cls_allocation_id}`)
                .then((res) => {
                    setSubData(res.data);
                    // Clear sub_id only when cls_allocation_id changes
                    if (previousClsAllocationIdRef.current !== formData.cls_allocation_id) {
                        setFormData(prevState => ({ ...prevState, sub_id: "" }));
                    }
                })
                .catch((err) => {
                    console.log('The error is :', err);
                });
        }
        // Update the previousClsAllocationIdRef with the current cls_allocation_id
        previousClsAllocationIdRef.current = formData.cls_allocation_id;
    }, [formData.cls_allocation_id]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const curt_year = parseInt(moment().format("YYYY"), 10);
    const prev_year = curt_year - 1;
    const nxt_year = curt_year + 1;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${config.apiURL}/staffAllocation/updateStaffAllocation/${data.staff_allocation_id}`, formData)
            .then((res) => {
                onClose()
            })
            .catch((err) => {
                console.log("Error save staff allocation", err);
            })
    }

    return (
        <div>
            <h1>Update Form</h1>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Class"
                        name="cls_id"
                        onChange={handleChangeInput}
                        value={formData.cls_id}
                    >
                        {clsData.map((cls) => (
                            <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Section"
                        name="cls_allocation_id"
                        onChange={handleChangeInput}
                        value={formData.cls_allocation_id}
                    >
                        {secData.map((sec) => (
                            <MenuItem key={sec.cls_allocation_id} value={sec.cls_allocation_id}>{sec.sec_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Subject"
                        name="sub_id"
                        onChange={handleChangeInput}
                        value={formData.sub_id}
                    >
                        {subData.map((sub) => (
                            <MenuItem key={sub.sub_id} value={sub.sub_id}>{sub.sub_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Select Staff"
                        name="staff_id"
                        onChange={handleChangeInput}
                        value={formData.staff_id}
                    >
                        {staffData.map((staff) => (
                            <MenuItem key={staff.staff_id} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        fullWidth
                        label="Academic Year"
                        name="academic_year"
                        onChange={handleChangeInput}
                        value={formData.academic_year}
                    >
                        <MenuItem value={`${prev_year}-${curt_year}`}>{prev_year}-{curt_year}</MenuItem>
                        <MenuItem value={`${curt_year}-${nxt_year}`}>{curt_year}-{nxt_year}</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='center'>
                    <Button variant='contained' color='success' startIcon={<Done/>} onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default UpdateStaffAllocation
