import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../../../config';
import { useNavigate } from 'react-router';

function PayFeesLog({ data, onClose }) {
    const [studentinfo, setStudentinfo] = useState({
        fees_id: data.fees_id,
        roll_no: data ? data.roll_no : "",
        fee_category: data ? data.fee_category : "",
        paid_amount: "",
        payment_method: ""
    });
    const [errors, setErrors] = useState({
        paid_amount: "",
        payment_method: ""
    });
    const navigate = useNavigate();

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = "";

        switch (name) {
            case "paid_amount":
                if (!trimmedValue) {
                    errmsg = "Please enter a paid amount";
                }
                break;
            case "payment_method":
                if (!trimmedValue) {
                    errmsg = "Please enter a payment method";
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

        axios.post(`${config.apiURL}/feeLogs/saveFeesLogs`, studentinfo)
            .then((res) => {
                console.log("Data Saved.");
                navigate(`/feeLogsByFeeId/${data.fees_id}`);
                onClose();
            })
            .catch((err) => {
                console.log("Error.", err);
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
                            name="roll_no"
                            label="Roll_No"
                            onChange={handleChange}
                            value={studentinfo.roll_no}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="fee_category"
                            label="Fee Category"
                            onChange={handleChange}
                            value={studentinfo.fee_category}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="paid_amount"
                            onChange={handleChange}
                            value={studentinfo.paid_amount}
                            error={!!errors.paid_amount}
                            helperText={errors.paid_amount}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Method Of Payment"
                            name="payment_method"
                            onChange={handleChange}
                            value={studentinfo.payment_method}
                            error={!!errors.payment_method}
                            helperText={errors.payment_method}
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

export default PayFeesLog;
