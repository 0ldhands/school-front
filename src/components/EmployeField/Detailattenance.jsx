
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { useParams } from 'react-router';

function DetailAttendance() {
    const { staff_id } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        axios.get(`${config.apiURL}/students/detailattenance/${staff_id}`)
            .then((res) => {
                setAttendanceData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [staff_id]);

    const formatDate = (dateString) => {
        const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);  // Using 'en-GB' ensures day-month-year order.
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const formatDateForComparison = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const filteredData = selectedDate 
        ? attendanceData.filter((data) => {
            const dataDate = formatDateForComparison(data.date);
            return dataDate === selectedDate;
        })
        : attendanceData;

    const tableStyle = {
        width: '600px',
        border: '3px solid black',
        borderCollapse: 'collapse',
        margin: '20px 0',
    };

    const headerStyle = {
        backgroundColor: 'black',
        color: 'white',
        borderBottom: '2px solid #ddd',
        padding: '10px',
        textAlign: 'left',
    };

    const cellStyle = {
        backgroundColor: 'lightgray',
        borderBottom: '1px solid #ddd',
        padding: '10px',
    };

    return (
        <div>
            <h4>Student Attendance Details</h4>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange} 
                style={{ margin: '20px 0', padding: '8px', fontSize: '16px' }}
            />
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Student Name</th>
                        <th style={headerStyle}>Status</th>
                        <th style={headerStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((data) => (
                        <tr key={data.stu_id}>
                            <td style={cellStyle}>{data.stu_name}</td>
                            <td style={cellStyle}>{data.status}</td>
                            <td style={cellStyle}>{formatDate(data.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DetailAttendance;
