import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import axios from 'axios'
import config from '../../../config';
import { useNavigate } from 'react-router';

function FeesApplication() {
    const navigate = useNavigate()

    const [rollno,setRollno] = useState([]);
    const [studentinfo, setStudentinfo] = useState({
        roll_no: "",
        academic_year: "",
        fee_category: "",
        amount: ""
    });
    const [err_student, setErr_Student] = useState({
        roll_no: "",
        academic_year: "",
        fee_category: "",
        amount: ""
    });

    const handleValidation = (name,value)=>{
    const trimmedValue = value && typeof value === "string" ? value.trim() : value;
    let errmsg = ""

    switch(name){
      case "roll_no":
        if(!trimmedValue){
            errmsg = " please enter Roll number"
        }
        break;
      case "academic_year":
        if(!trimmedValue){
            errmsg = " please enter academic_year"
        }
        break;
      case "fee_category":
        if(!trimmedValue){
            errmsg = " please enter fee_category"
        }
        break;
      case "amount":
        if(!trimmedValue){
            errmsg = " please enter amount"
        }
        break;
     default :
        break;
    }
    return errmsg
    }

    useEffect(() => {
        axios.get(`${config.apiURL}/stuAllocation/getRollNo`)
        .then((res) => {
            setRollno(res.data)
        })
        .catch((err) => {
            console.log("Error fetching Class data", err);
        });

      
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name,value)
        setErr_Student({...err_student,[name]:error})
        setStudentinfo({ ...studentinfo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formerror = {}
        Object.keys(studentinfo).forEach((name)=>{
            const value = studentinfo[name]
            const error = handleValidation(name,value)
            if(error){
                formerror[name]=error
            }
        })
        if(Object.keys(formerror).length > 0){
            setErr_Student(formerror)
            return;
        }

        axios.post(`${config.apiURL}/feeAllocation/saveFeesAllocation`, studentinfo)
            .then((res) => {
                console.log("Success");
                console.log("Data:", studentinfo);
            })
            .catch((err) => {
                console.log("Error:", err);
                console.log("Data:", studentinfo);
            });
        
        navigate(-1);
    };

    return (
        <div>
            <h1>Student admission form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth
                            select
                            name="roll_no"
                            label="Roll_No"
                            error={!!err_student.roll_no}
                            helperText={err_student.roll_no}
                            onChange={handleChange}
                            value={studentinfo.roll_no}
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
                            error={!!err_student.academic_year}
                            helperText={err_student.academic_year}
                            value={studentinfo.academic_year}
                        >
                            {rollno.map((sec, index) => (
                                <MenuItem key={index} value={sec.academic_year}>{sec.academic_year}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth
                            label="Fee Category"
                            variant="outlined"
                            name="fee_category"
                            error={!!err_student.fee_category}
                            helperText={err_student.fee_category}
                            onChange={handleChange}
                            value={studentinfo.fee_category}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            fullWidth
                            label="Amount"
                            variant="outlined"
                            name="amount"
                            error={!!err_student.amount}
                            helperText={err_student.amount}
                            onChange={handleChange}
                            value={studentinfo.amount}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            style={{ marginTop: '20px', backgroundColor: '#4CAF50', color: 'white' }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
    
}
export default FeesApplication;
