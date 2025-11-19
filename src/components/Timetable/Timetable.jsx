import React, { useEffect, useState } from 'react';
import { Alert, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import config from '../../config';

function Timetable() {
    const [secData, setSecData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [formData, setFormData] = useState({
        cls_id: "",
        cls_allocation_id: "",
        file: null,
        academic_year: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
            .then((res) => {
                setClsData(res.data);
            })
            .catch((err) => {
                console.error("Error fetching class allocation data", err);
            });
    }, []);

    useEffect(() => {
        if (formData.cls_id) {
            axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${formData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching section allocation data", err);
                });
        } else {
            setSecData([]);
        }
        setFormData((prevState) => ({ ...prevState, cls_allocation_id: "" }));
    }, [formData.cls_id]);

    const handleChangeInput = (e) => {
        const { name, value, files } = e.target;
        const error = handleValidation(name, value);
        setErrors((prevState) => ({ ...prevState, [name]: error }));
        if (files) {
            setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = "";

        switch (name) {
            case "cls_id":
                if (!trimmedValue) {
                    errmsg = "Please select Class";
                }
                break;
            case "cls_allocation_id":
                if (!trimmedValue) {
                    errmsg = "Please select Section";
                }
                break;
            case "file":
                if (!value) {
                    errmsg = "Please select a file";
                }
                break;
            case "academic_year":
                if (!trimmedValue) {
                    errmsg = "Please select Academic Year";
                }
                break;
            default:
                break;
        }
        return errmsg;
    };

    const handleSubmit = () => {
        const formErrors = {};
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('timetable', formData.file);
        formDataToSend.append('cls_allocation_id', formData.cls_allocation_id);
        formDataToSend.append('academic_year', formData.academic_year);

        axios.post(`${config.apiURL}/timetable/saveTimeTable`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                setMessage({ type: 'success', text: 'Time table saved successfully.' });
                setFormData({
                    cls_id: "",
                    cls_allocation_id: "",
                    file: null,
                    academic_year: ""
                });
            })
            .catch(error => {
                console.error('Error:', error);
                setMessage({ type: 'error', text: error.response?.data?.message || 'An unexpected error occurred.' });
            });
    };

    return (
        <div>
            <h1>Add Time Table</h1>
            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Select Class"
                        name="cls_id"
                        onChange={handleChangeInput}
                        value={formData.cls_id}
                        error={!!errors.cls_id}
                        helperText={errors.cls_id}
                    >
                        {clsData.map((cls) => (
                            <MenuItem key={cls.cls_id} value={cls.cls_id}>
                                {cls.cls_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Select Section"
                        name="cls_allocation_id"
                        onChange={handleChangeInput}
                        value={formData.cls_allocation_id}
                        error={!!errors.cls_allocation_id}
                        helperText={errors.cls_allocation_id}
                        disabled={!formData.cls_id}
                    >
                        {secData.map((sec) => (
                            <MenuItem key={sec.cls_allocation_id} value={sec.cls_allocation_id}>
                                {sec.sec_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type='file'
                        label="Time Table"
                        name='file'
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeInput}
                        error={!!errors.file}
                        helperText={errors.file}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Select Academic Year"
                        name="academic_year"
                        onChange={handleChangeInput}
                        value={formData.academic_year}
                        error={!!errors.academic_year}
                        helperText={errors.academic_year}
                    />
                </Grid>
            </Grid>
            <Button onClick={handleSubmit} variant="contained" color="primary">Add Table</Button>
        </div>
    );
}

export default Timetable;
