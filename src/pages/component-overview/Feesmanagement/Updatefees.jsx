import React, { useEffect, useState } from 'react';
import { Grid, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../../../config';

function Updatefees({ data, onClose }) {
    const [rollno, setRollno] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        roll_no: data ? data.roll_no : "",
        academic_year: data ? data.academic_year : "",
        fee_category: data ? data.fee_category : "",
        amount: data ? data.amount : ""
    });
    const [errors, setErrors] = useState({
        roll_no: "",
        academic_year: "",
        fee_category: "",
        amount: ""
    });

    useEffect(() => {
        axios.get(`${config.apiURL}/stuAllocation/getRollNo`)
            .then((res) => {
                setRollno(res.data);
            })
            .catch((err) => {
                console.log("Error fetching Class data", err);
            });
    }, []);

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = "";

        switch (name) {
            case "roll_no":
                if (!trimmedValue) {
                    errmsg = "Please select Roll number";
                }
                break;
            case "academic_year":
                if (!trimmedValue) {
                    errmsg = "Please select academic year";
                }
                break;
            case "fee_category":
                if (!trimmedValue) {
                    errmsg = "Please enter fee category";
                }
                break;
            case "amount":
                if (!trimmedValue) {
                    errmsg = "Please enter amount";
                }
                break;
            default:
                break;
        }
        return errmsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name, value);
        setErrors({ ...errors, [name]: error });
        setStudentinfo({ ...studentinfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        Object.keys(studentinfo).forEach((name) => {
            const value = studentinfo[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        axios.put(`${config.apiURL}/feeAllocation/updateFeesAllocation/${data.fees_id}`, studentinfo)
            .then((res) => {
                console.log("Data updated.");
                onClose();
            })
            .catch((err) => {
                console.log("error update fees.");
            });
    };

    return (
        <div>
            <h1>Admission form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="roll_no"
                            label="Roll_No"
                            onChange={handleChange}
                            value={studentinfo.roll_no}
                            error={!!errors.roll_no}
                            helperText={errors.roll_no}
                        >
                            {rollno.map((sec, index) => (
                                <MenuItem key={index} value={sec.roll_no}>{sec.roll_no}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            name="academic_year"
                            label="Academic Year"
                            onChange={handleChange}
                            value={studentinfo.academic_year}
                            error={!!errors.academic_year}
                            helperText={errors.academic_year}
                        >
                            {rollno.map((sec, index) => (
                                <MenuItem key={index} value={sec.academic_year}>{sec.academic_year}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="fee_category"
                            label="Fee Category"
                            onChange={handleChange}
                            value={studentinfo.fee_category}
                            error={!!errors.fee_category}
                            helperText={errors.fee_category}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            onChange={handleChange}
                            value={studentinfo.amount}
                            error={!!errors.amount}
                            helperText={errors.amount}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button type="submit">Submit</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default Updatefees;
