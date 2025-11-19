import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config'
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Done } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const AddStaffAllocation = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [clsData,setClsData] = useState([]);
    const [secData,setSecData] = useState([]);
    const [subData,setSubData] = useState([]);
    const [staffData,setStaffData] = useState([]);
    const navigate = useNavigate();
        const [formData,setFormData] = useState({
            staff_id : "",
            cls_id : "",
            cls_allocation_id : "",
            sub_id : "",
            academic_year : "",
        });
        const [errData,setErrData] = useState({
            staff_id : "",
            cls_id : "",
            cls_allocation_id : "",
            sub_id : "",
            academic_year : "",
        });

        const handleValidation = (name,value)=>{
        const trimmedValue = value && typeof value === "string" ? value.trim() : value;
        let errmsg = ""

    switch(name){
        case "staff_id":
            if(!trimmedValue){
                errmsg= "please enter staff name"
            }
            break;
        case "cls_id":
            if(!trimmedValue){
                errmsg= "please enter cls_id"
            }
            break;
        case "cls_allocation_id":
            if(!trimmedValue){
                errmsg= "please enter cls_allocation_id"
            }
            break;
        case "sub_id":
            if(!trimmedValue){
                errmsg= "please enter sub_id"
            }
            break;
        case "academic_year":
            if(!trimmedValue){
                errmsg= "please enter academic_year"
            }
            break;
         default:
            break;    
    }
        return errmsg
        }
    useEffect(()=>{
        axios.get(`${config.apiURL}/staffs/getStaffs`)
        .then((res)=>{
          setStaffData(res.data)
        })
        .catch((err)=>{
          console.log('The error is :',err);
        })
    },[])
    useEffect(()=>{
        axios.get(`${config.apiURL}/clsAndSec/getClass`)
        .then((res)=>{
          setClsData(res.data)
        })
        .catch((err)=>{
          console.log('The error is :',err);
        })
    },[])

    useEffect(() => {
        setFormData({ ...formData, sec_id: "" }); 
        if(formData.cls_id){
            axios.get(`${config.apiURL}/clsAndSec/getClsAndSecAllocationByClsId?cls_id=${formData.cls_id}`)
            .then((res) => {
                setSecData(res.data);
                console.log("Sec Data :",secData)
            })
            .catch((err) => {
                console.log('The error is :', err);
            });
        }
    }, [formData.cls_id]);

    useEffect(() => {
        setFormData({ ...formData, sub_id: "" }); 
        if(formData.cls_allocation_id){
            axios.get(`${config.apiURL}/subject/getSubjects/${formData.cls_allocation_id}`)
            .then((res) => {
                setSubData(res.data);
            })
            .catch((err) => {
                console.log('The error is :', err);
            });
        }
    }, [formData.cls_id,formData.cls_allocation_id]);

    const handleChangeInput = (e) =>{
        const {name,value} = e.target;
        const error = handleValidation(name,value)
        setErrData({...errData,[name]:error})
        setFormData({...formData,[name]:value})
    }
    const curt_year = parseInt(moment().format("YYYY"), 10);
    const prev_year = curt_year - 1;
    const nxt_year = curt_year + 1;

    const handleSubmit = (e) =>{
        e.preventDefault();
        const formerror ={}
      Object.keys(formData).forEach((name)=>{
        const value = formData[name]
        const error = handleValidation(name,value)
        if (error) {
            formerror[name] = error
        }
      })

      if(Object.keys(formerror).length > 0){
        setErrData(formerror)
        return;
      }

        axios.post(`${config.apiURL}/staffAllocation/postStaffAllocation`,formData)
        .then((res)=>{
            alert(res.message)
            
            enqueueSnackbar('Staff alloated sucessfully', { variant: 'success' });
            navigate('/staffAllocationIndex')
        })
        .catch((err)=>{
            console.log("Error save staff allocation")
        })
    }
  return (
    <div>
        <h1>Staff Allocation Form</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <TextField
            select
            fullWidth
            label = "Select Class"
            name = "cls_id"
            error={!!errData.cls_id}
            helperText ={errData.cls_id}
            onChange={handleChangeInput}
            value={formData.cls_id}
            >
                {clsData.map((cls)=>(
                    <MenuItem value={cls.cls_id}>{cls.cls_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item xs={6}>
        <TextField
         select
         fullWidth
            label = "Select Section"
            name = "cls_allocation_id"
            onChange={handleChangeInput}
            error={!!errData.cls_allocation_id}
            helperText ={errData.cls_allocation_id}
            value={formData.cls_allocation_id}
            >
                {secData.map((sec)=>(
                    <MenuItem value={sec.cls_allocation_id}>{sec.sec_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item xs={6}>
        <TextField
         select
         fullWidth
            label = "Select Subject"
            name = "sub_id"
            onChange={handleChangeInput}
            error={!!errData.sub_id}
            helperText ={errData.sub_id}
            value={formData.sub_id}
            >
                {subData.map((sub)=>(
                    <MenuItem value={sub.sub_id}>{sub.sub_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item xs={6}>
        <TextField
         select
         fullWidth
            label = "Select Staff"
            name = "staff_id"
            onChange={handleChangeInput}
            error={!!errData.staff_id}
            helperText ={errData.staff_id}
            value={formData.staff_id}
            >
                {staffData.map((staff)=>(
                    <MenuItem value={staff.staff_id}>{staff.staff_name}</MenuItem>
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
                        error={!!errData.academic_year}
                        helperText ={errData.academic_year}
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

export default AddStaffAllocation
