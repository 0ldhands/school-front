import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import config from '../../config'
import { Done } from '@mui/icons-material';
function UpdateDepartment({ data, onClose }) {
    const [deptInfo, setDeptInfo] = useState({
        dept_id: data ? data.dept_id : "",
        dept_name: data ? data.dept_name : "",
    });
    const [errorDept,setErrorDept] = useState({
        dept_id:"",
        dept_name:""
    })
    const handleValidation =(name,value)=>{
     const trimmedValue = value && typeof value === "string" ? value.trim() : value;
     let errMsg = "";

     switch(name){
        case "dept_name":
            if(!trimmedValue){
                errMsg="please enter the department"
            }
            break;
         default:
            break;    
     }
     return errMsg
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name,value)
        setErrorDept({...errorDept,[name]:error})
        setDeptInfo({ ...deptInfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formerrors ={}
        Object.keys(deptInfo).forEach((name)=>{
            const value = deptInfo[name]
            const error = handleValidation(name,value)
            if(error){
                formerrors[name] =error
            }
        })
            if(Object.keys(formerrors).length > 0){
                setErrorDept(formerrors);
                return
            }

        axios.put(`${config.apiURL}/department/updateDept/${data.dept_id}`, deptInfo)
            .then((res) => {
                console.log("Success");
                onClose();
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };

    return (
        <div>
            <h1>Department Update Form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            label="Department Name"
                            variant="outlined"
                            name="dept_name"
                            error={!!errorDept.dept_name}
                            helperText={errorDept.dept_name}
                            value={deptInfo.dept_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit" variant='contained' startIcon={<Done/>} color='success'>Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default UpdateDepartment;
