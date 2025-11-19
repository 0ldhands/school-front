
import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../../config';

function Allotfees({ data, onClose }) {
    const [totalfees, setTotalfees] = useState(0); // Initialize totalfees state with 0
    const [studentinfo, setStudentinfo] = useState({
        stu_name: data ? data.stu_name : "",
        tution_fees: data ? data.tution_fees : "",
        transport_fees: data ? data.transport_fees : "",
        additional_fees: data ? data.additional_fees : "", 
        firstinstallment: data ? data.firstinstallment : "",
        secondinstallment: data ? data.secondinstallment : "",
        discount: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentinfo({ ...studentinfo, [name]: value });
        const total = calculateTotal({ ...studentinfo, [name]: value });
        setTotalfees(total);
    };

    const calculateTotal = ({ tution_fees, discount }) => {
        const tution = parseInt(tution_fees) || 0; // Default to 0 if empty or NaN
        // const transport = parseInt(transport_fees) || 0;
        // const additional = parseInt(additional_fees) || 0;
        const discoun = parseInt(discount) || 0;
        return (tution ) - discoun;
    };

    const validate = () => {
        let tempErrors = {};
        if (!studentinfo.stu_name) tempErrors.stu_name = "Student name is required";
        if (!studentinfo.tution_fees) tempErrors.tution_fees = "Tuition fees are required";
        // if (!studentinfo.transport_fees) tempErrors.transport_fees = "transport fees are required";
        // if (!studentinfo.additional_fees) tempErrors.additional_fees = "Eca fees are required";
        if (!studentinfo.firstinstallment) tempErrors.firstinstallment = "First installment fees are required";
        if (!studentinfo.secondinstallment) tempErrors.secondinstallment = "Second installment fees are required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const { stu_name, tution_fees, transport_fees, additional_fees, firstinstallment, secondinstallment, discount } = studentinfo;
        const total = calculateTotal(studentinfo);

        const formData = {
            stu_name,
            tution_fees,
            additional_fees,
            firstinstallment,
            secondinstallment,
            transport_fees,
            total_fees: total,
            pending_fees: total,
            discount,
        };

        axios.put(`${config.apiURL}/allfeesalloc/${data.stu_id}`, formData)
            .then((res) => {
                console.log(res);
                onClose();
            })
            .catch((err) => {
                console.log("Error updating fees.", err);
            });
    };

    return (
        <div>
            <h1>Fees form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="stu_name"
                            label="Student Name"
                            value={studentinfo.stu_name}
                            onChange={handleChange}
                            error={!!errors.stu_name}
                            helperText={errors.stu_name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="tution_fees"
                            label="Tuition Fees"
                            value={studentinfo.tution_fees}
                            onChange={handleChange}
                            error={!!errors.tution_fees}
                            helperText={errors.tution_fees}
                        />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="transport_fees"
                            label="Transport Fees"
                            value={studentinfo.transport_fees}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="ECA Fees"
                            name="additional_fees"
                            value={studentinfo.additional_fees}
                            onChange={handleChange}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="1st Installment Fees"
                            name="firstinstallment"
                            value={studentinfo.firstinstallment}
                            onChange={handleChange}
                            error={!!errors.firstinstallment}
                            helperText={errors.firstinstallment}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="2nd Installment Fees"
                            name="secondinstallment"
                            value={studentinfo.secondinstallment}
                            onChange={handleChange}
                            error={!!errors.secondinstallment}
                            helperText={errors.secondinstallment}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Discount"
                            name="discount"
                            value={studentinfo.discount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Total Fees"
                            value={totalfees}
                            InputProps={{
                                readOnly: true,
                            }}
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

export default Allotfees;
