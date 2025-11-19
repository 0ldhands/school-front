import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import DoneIcon from '@mui/icons-material/Done';


const AddDepartment = () => {
    const [formData, setFormData] = useState({
        dept_name: ""
    });
    const [errorData, setErrorData] = useState({
        dept_name: ""
    });

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errorMessage = "";

        switch (name) {
            case "dept_name":
                if (!trimmedValue) {
                    errorMessage = 'Please enter the department name';
                }
                break;
            default:
                break;
        }
        return errorMessage;
    };

    const navigate = useNavigate();

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setFormData({ ...formData, [name]: value });
        setErrorData({ ...errorData, [name]: error });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrorData(formErrors);
            return;
        }

        axios.post(`${config.apiURL}/department/saveDept`, formData)
            .then((res) => {
                setFormData({ dept_name: '' });
                console.log(res);
                navigate('/department');
            })
            .catch((err) => {
                console.log("Error Form Data added :", err);
            });
    };

    return (
        <>
            <TextField
                name="dept_name"
                label="Department Name"
                onChange={handleChangeInput}
                value={formData.dept_name}
                error={!!errorData.dept_name}
                helperText={errorData.dept_name}
            />
            <Button variant='contained' color='success' style={{marginLeft:"30px"}} startIcon={<DoneIcon/>} onClick={handleSubmit}>Submit</Button>
        </>
    );
};

export default AddDepartment;
