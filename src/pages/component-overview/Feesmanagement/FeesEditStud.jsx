import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../../../config';

function FeesEditStud({ data, onClose }) {
    const [editedStudFee, setEditedStudFee] = useState({
        fees_id: data ? data.fees_id : "",
        fee_category: data ? data.fee_category : "",
        paid_amount: data ? data.paid_amount : "",
        roll_no: data ? data.roll_no : "",
        payment_method: data ? data.payment_method : ""
    });
    const [errEditedStudFee, setErrEditedStudFee] = useState({
        fee_category: "",
        paid_amount: "",
        payment_method: ""
    });

    const handleValidation = (name, value) => {
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = "";

        switch (name) {
            case "fee_category":
                if (!trimmedValue) {
                    errmsg = "Please enter a fee category";
                }
                break;
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
        setErrEditedStudFee({ ...errEditedStudFee, [name]: error });
        setEditedStudFee({ ...editedStudFee, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = {};
        Object.keys(editedStudFee).forEach((name) => {
            const value = editedStudFee[name];
            const error = handleValidation(name, value);
            if (error) {
                formErrors[name] = error;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrEditedStudFee(formErrors);
            return;
        }

        axios.put(`${config.apiURL}/feeLogs/updateFeesLog/${data.log_id}`, editedStudFee)
            .then((res) => {
                console.log("Data Saved.");
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
                            value={editedStudFee.roll_no}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="fee_category"
                            label="Fee Category"
                            onChange={handleChange}
                            value={editedStudFee.fee_category}
                            error={!!errEditedStudFee.fee_category}
                            helperText={errEditedStudFee.fee_category}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="paid_amount"
                            onChange={handleChange}
                            value={editedStudFee.paid_amount}
                            error={!!errEditedStudFee.paid_amount}
                            helperText={errEditedStudFee.paid_amount}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Method Of Payment"
                            name="payment_method"
                            onChange={handleChange}
                            value={editedStudFee.payment_method}
                            error={!!errEditedStudFee.payment_method}
                            helperText={errEditedStudFee.payment_method}
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

export default FeesEditStud;
