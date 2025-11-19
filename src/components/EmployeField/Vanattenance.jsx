
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
import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import { useParams, Link } from 'react-router-dom';

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

const VanAttendance = () => {
    const { staff_id } = useParams();
    const [vanStudents, setVanStudents] = useState([]);
    const [attendanceState, setAttendanceState] = useState({
        attendanceData: {},
        attendanceDate: new Date().toISOString().slice(0, 10),
    });
    const [markAllPresent, setMarkAllPresent] = useState(false);

    useEffect(() => {
        axios.get(`${config.apiURL}/students/vanattenance/${staff_id}`)
            .then((res) => {
                setVanStudents(res.data);
            })
            .catch((err) => {
                console.error('Error fetching van students data:', err);
            });
    }, [staff_id]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceState((prevState) => ({
            ...prevState,
            attendanceData: {
                ...prevState.attendanceData,
                [studentId]: status,
            },
        }));
    };

    const handleMarkAllPresentChange = (e) => {
        const isChecked = e.target.checked;
        setMarkAllPresent(isChecked);

        const updatedAttendanceData = {};
        vanStudents.forEach((student) => {
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
                const student = vanStudents.find((s) => s.stu_id === parseInt(studentId));

                const formData = {
                    staff_id: student.staff_id,
                    stu_name: student.stu_name,
                    stu_id: student.stu_id,
                    cls_id: student.cls_id,
                    thatdate: attendanceDate,
                    statusn: status,
                };

                console.log("Form Data:", formData);

                await axios.post(`${config.apiURL}/students/vanattenancepost`, formData);

                console.log(`Updated attendance for student ${studentId}:`, formData);
            }

            console.log("Attendance data submitted successfully!");
            alert("Attendance data submitted successfully!");
        } catch (err) {
            console.error('Error saving attendance:', err);
            alert('Error saving attendance. Please try again.');
        }
    };

    return (
        <div>
            <Link to={`/vanattenancedetails/${staff_id}`}>
                <Button variant="contained" color="primary">Details</Button>
            </Link>
            <br /><br />

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
                            {vanStudents.map((student) => (
                                <StyledTableRow key={student.stu_id}>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {student.stu_id}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{student.stu_name}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <FormControl component="fieldset">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={attendanceState.attendanceData[student.stu_id] === 'present'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(student.stu_id, e.target.checked ? 'present' : 'absent')
                                                        }
                                                        name={`attendance-${student.stu_id}`}
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
                                                        checked={attendanceState.attendanceData[student.stu_id] === 'absent'}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(student.stu_id, e.target.checked ? 'absent' : 'present')
                                                        }
                                                        name={`attendance-${student.stu_id}`}
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
        </div>
    );
};

export default VanAttendance;
