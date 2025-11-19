
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox, FormControl, FormControlLabel, TextField, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

function Students() {
    const staff_id = sessionStorage.getItem('staff_id');
    const [studentData, setStudentData] = useState([]);
    const [attendanceState, setAttendanceState] = useState({
        attendanceData: {},
        attendanceDate: new Date().toISOString().slice(0, 10),
    });
    const [markAllPresent, setMarkAllPresent] = useState(false);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        axios.get(`${config.apiURL}/attenance/classstudents/${staff_id}`)
            .then((res) => {
                setStudentData(res.data);
            })
            .catch((err) => {
                console.error('Error fetching student data:', err);
            });
    }, [staff_id, config.apiURL]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceState((prevState) => ({
            ...prevState,
            attendanceData: {
                ...prevState.attendanceData,
                [studentId]: status,
            },
        }));
    };

    const [isHovered, setIsHovered] = useState({
        details: false,
        van: false,
    });

    const handleMouseEnter = (button) => {
        setIsHovered((prevState) => ({
            ...prevState,
            [button]: true,
        }));
    };

    const handleMouseLeave = (button) => {
        setIsHovered((prevState) => ({
            ...prevState,
            [button]: false,
        }));
    };

    const buttonStyle = (hovered) => ({
        backgroundColor: hovered ? '#13c3c2' : '#1677ff',
        color: 'black',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
    });

    const handleMarkAllPresentChange = (e) => {
        const isChecked = e.target.checked;
        setMarkAllPresent(isChecked);

        const updatedAttendanceData = {};
        studentData.forEach((student) => {
            updatedAttendanceData[student.stu_id] = isChecked ? 'present' : 'absent';
        });
        setAttendanceState((prevState) => ({
            ...prevState,
            attendanceData: updatedAttendanceData,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { attendanceData, attendanceDate } = attendanceState;

        try {
            for (const studentId in attendanceData) {
                const status = attendanceData[studentId];
                const student = studentData.find((s) => s.stu_id === parseInt(studentId));

                const formData = {
                    staff_id: staff_id,
                    stu_id: student.stu_id,
                    cls_id: student.cls_id,
                    date: attendanceDate,
                    status: status,
                };

                await axios.post(`${config.apiURL}/students/studentsattenance`, formData);

                console.log(`Updated attendance for student ${studentId}:`, formData);
            }

            // Trigger Snackbar on success
            setSnackbarMessage("Attendance data submitted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error saving attendance:', err);
            // Handle error scenario
            setSnackbarMessage("Error saving attendance!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Link to={`/attenancedetails/${staff_id}`}>
                <Button
                    style={buttonStyle(isHovered.details)}
                    onMouseEnter={() => handleMouseEnter('details')}
                    onMouseLeave={() => handleMouseLeave('details')}
                >
                    Attendance Details
                </Button>
            </Link>
            <Link to={`/vanattenance/${staff_id}`}>
                <Button
                    style={buttonStyle(isHovered.van)}
                    onMouseEnter={() => handleMouseEnter('van')}
                    onMouseLeave={() => handleMouseLeave('van')}
                >
                    Van Attendance
                </Button>
            </Link>
            <br /><br /><br />

            <form onSubmit={handleSubmit}>
                <TextField
                    type="date"
                    label="Attendance Date"
                    value={attendanceState.attendanceDate}
                    onChange={(e) => setAttendanceState({ ...attendanceState, attendanceDate: e.target.value })}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className="mb-3"
                />
                <TableContainer component={Paper} className="mt-3">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">STUDENT ID</StyledTableCell>
                                <StyledTableCell align="center">STUDENT NAME</StyledTableCell>
                                <StyledTableCell align="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={markAllPresent}
                                                onChange={handleMarkAllPresentChange}
                                            />
                                        }
                                        label="Mark All Present"
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="center">ABSENT</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentData.map((data) => (
                                <StyledTableRow key={data.stu_id}>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {data.stu_id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{data.stu_name}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <FormControl component="fieldset">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={attendanceState.attendanceData[data.stu_id] === 'present'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(data.stu_id, e.target.checked ? 'present' : 'absent')
                                                        }
                                                        name={`attendance-${data.stu_id}`}
                                                    />
                                                }
                                                label="Present"
                                            />
                                        </FormControl>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <FormControl component="fieldset">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={attendanceState.attendanceData[data.stu_id] === 'absent'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(data.stu_id, e.target.checked ? 'absent' : 'present')
                                                        }
                                                        name={`attendance-${data.stu_id}`}
                                                    />
                                                }
                                                label="Absent"
                                            />
                                        </FormControl>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="success" type="submit" className="mt-4">
                    Submit
                </Button>
            </form>

            {/* Snackbar for success and error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Students;
