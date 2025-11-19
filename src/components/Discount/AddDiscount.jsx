import React, { useState } from 'react';
import { Grid, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import { useNavigate } from 'react-router';

function AddDiscount({ data, onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fees_id: data.fees_id,
        roll_no: data ? data.roll_no : "",
        fee_category: data ? data.fee_category : "",
        discount_amount: "",
        discount_percentage: "",
        discount_type: "",
        reason: ""
    });
    const [errors, setErrors] = useState({
        discount_type: "",
        discount_amount: "",
        discount_percentage: "",
        reason: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleValidation = () => {
        const { discount_type, discount_amount, discount_percentage, reason } = formData;
        const errors = {};

        if (!discount_type) {
            errors.discount_type = "Please select a discount type";
        }

        if (discount_type === "Amount" && !discount_amount) {
            errors.discount_amount = "Please enter a discount amount";
        }

        if (discount_type === "Percentage" && !discount_percentage) {
            errors.discount_percentage = "Please enter a discount percentage";
        }

        if (!reason) {
            errors.reason = "Please enter a reason";
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!handleValidation()) {
            return;
        }

        const payload = {
            fees_id: formData.fees_id,
            roll_no: formData.roll_no,
            fee_category: formData.fee_category,
            reason: formData.reason,
        };

        if (formData.discount_type === "Amount") {
            payload.discount_amount = formData.discount_amount;
        } else if (formData.discount_type === "Percentage") {
            payload.discount_percentage = formData.discount_percentage;
        }

        axios.post(`${config.apiURL}/discount/saveDiscount`, payload)
            .then((res) => {
                console.log("Data Saved.");
                navigate(`/singleFeesDiscountIndex/${data.fees_id}`);
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
                            label="Roll No"
                            onChange={handleChange}
                            value={formData.roll_no}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="fee_category"
                            label="Fee Category"
                            onChange={handleChange}
                            value={formData.fee_category}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            select
                            name="discount_type"
                            label="Discount Type"
                            onChange={handleChange}
                            value={formData.discount_type}
                            error={!!errors.discount_type}
                            helperText={errors.discount_type}
                        >
                            <MenuItem value="Amount">Amount</MenuItem>
                            <MenuItem value="Percentage">Percentage</MenuItem>
                        </TextField>
                    </Grid>
                    {formData.discount_type === "Amount" && (
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                name="discount_amount"
                                label="Discount Amount"
                                onChange={handleChange}
                                value={formData.discount_amount}
                                error={!!errors.discount_amount}
                                helperText={errors.discount_amount}
                            />
                        </Grid>
                    )}
                    {formData.discount_type === "Percentage" && (
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                name="discount_percentage"
                                label="Discount Percentage"
                                onChange={handleChange}
                                value={formData.discount_percentage}
                                error={!!errors.discount_percentage}
                                helperText={errors.discount_percentage}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            name="reason"
                            label="Reason"
                            onChange={handleChange}
                            value={formData.reason}
                            error={!!errors.reason}
                            helperText={errors.reason}
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

export default AddDiscount;
